const QR_SIZE = 21;
const DATA_CODEWORDS = 19;
const ECC_CODEWORDS = 7;

function gfTables() {
  const exp = new Uint8Array(512);
  const log = new Uint8Array(256);
  let value = 1;
  for (let index = 0; index < 255; index += 1) {
    exp[index] = value;
    log[value] = index;
    value <<= 1;
    if (value & 0x100) value ^= 0x11d;
  }
  for (let index = 255; index < exp.length; index += 1) exp[index] = exp[index - 255];
  return { exp, log };
}

const GF = gfTables();

function gfMultiply(left: number, right: number) {
  if (left === 0 || right === 0) return 0;
  return GF.exp[GF.log[left] + GF.log[right]];
}

function generatorPolynomial(degree: number) {
  let polynomial = [1];
  for (let index = 0; index < degree; index += 1) {
    const next = new Array(polynomial.length + 1).fill(0);
    for (let term = 0; term < polynomial.length; term += 1) {
      next[term] ^= polynomial[term];
      next[term + 1] ^= gfMultiply(polynomial[term], GF.exp[index]);
    }
    polynomial = next;
  }
  return polynomial;
}

function appendBits(bits: number[], value: number, length: number) {
  for (let shift = length - 1; shift >= 0; shift -= 1) bits.push((value >>> shift) & 1);
}

function makeCodewords(text: string) {
  const bytes = new TextEncoder().encode(text);
  if (bytes.length > 17) throw new Error("QR payload is too long for version 1-L");
  const bits: number[] = [];
  appendBits(bits, 0b0100, 4);
  appendBits(bits, bytes.length, 8);
  for (const byte of bytes) appendBits(bits, byte, 8);
  for (let index = 0; index < Math.min(4, DATA_CODEWORDS * 8 - bits.length); index += 1) bits.push(0);
  while (bits.length % 8) bits.push(0);
  const data: number[] = [];
  for (let offset = 0; offset < bits.length; offset += 8) {
    let byte = 0;
    for (let bit = 0; bit < 8; bit += 1) byte = (byte << 1) | bits[offset + bit];
    data.push(byte);
  }
  let pad = true;
  while (data.length < DATA_CODEWORDS) {
    data.push(pad ? 0xec : 0x11);
    pad = !pad;
  }

  const generator = generatorPolynomial(ECC_CODEWORDS);
  const remainder = new Uint8Array(DATA_CODEWORDS + ECC_CODEWORDS);
  remainder.set(data);
  for (let index = 0; index < DATA_CODEWORDS; index += 1) {
    const factor = remainder[index];
    if (!factor) continue;
    for (let term = 0; term < generator.length; term += 1) {
      remainder[index + term] ^= gfMultiply(generator[term], factor);
    }
  }
  return [...data, ...remainder.slice(DATA_CODEWORDS)];
}

function placeFinder(matrix: (number | null)[][], reserved: boolean[][], left: number, top: number) {
  for (let dy = -1; dy <= 7; dy += 1) {
    for (let dx = -1; dx <= 7; dx += 1) {
      const x = left + dx;
      const y = top + dy;
      if (x < 0 || y < 0 || x >= QR_SIZE || y >= QR_SIZE) continue;
      const separator = dx === -1 || dx === 7 || dy === -1 || dy === 7;
      const finder = dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
      matrix[y][x] = separator ? 0 : finder ? 1 : 0;
      reserved[y][x] = true;
    }
  }
}

function formatCoordinates() {
  const coordinates: [number, number][] = [];
  for (let index = 0; index < 15; index += 1) {
    const firstRow = index < 6 ? index : index < 8 ? index + 1 : QR_SIZE - 15 + index;
    coordinates.push([8, firstRow]);
  }
  for (let index = 0; index < 15; index += 1) {
    const firstColumn = index < 8 ? QR_SIZE - index - 1 : index < 9 ? 15 - index : 15 - index - 1;
    coordinates.push([firstColumn, 8]);
  }
  return coordinates;
}

export function qrMatrix(text: string) {
  const matrix = Array.from({ length: QR_SIZE }, () => Array<number | null>(QR_SIZE).fill(null));
  const reserved = Array.from({ length: QR_SIZE }, () => Array<boolean>(QR_SIZE).fill(false));
  placeFinder(matrix, reserved, 0, 0);
  placeFinder(matrix, reserved, QR_SIZE - 7, 0);
  placeFinder(matrix, reserved, 0, QR_SIZE - 7);

  for (let index = 8; index < QR_SIZE - 8; index += 1) {
    matrix[6][index] = index % 2 === 0 ? 1 : 0;
    matrix[index][6] = index % 2 === 0 ? 1 : 0;
    reserved[6][index] = true;
    reserved[index][6] = true;
  }
  matrix[QR_SIZE - 8][8] = 1;
  reserved[QR_SIZE - 8][8] = true;
  for (const [x, y] of formatCoordinates()) {
    reserved[y][x] = true;
    if (matrix[y][x] === null) matrix[y][x] = 0;
  }

  const codewords = makeCodewords(text);
  const bits: number[] = [];
  for (const codeword of codewords) appendBits(bits, codeword, 8);
  let bitIndex = 0;
  let row = QR_SIZE - 1;
  let direction = -1;
  for (let column = QR_SIZE - 1; column > 0; column -= 2) {
    if (column === 6) column -= 1;
    while (true) {
      for (let offset = 0; offset < 2; offset += 1) {
        const x = column - offset;
        if (reserved[row][x]) continue;
        const dataBit = bits[bitIndex] ?? 0;
        const mask = (row + x) % 2 === 0 ? 1 : 0;
        matrix[row][x] = dataBit ^ mask;
        bitIndex += 1;
      }
      row += direction;
      if (row >= 0 && row < QR_SIZE) continue;
      row -= direction;
      direction = -direction;
      break;
    }
  }

  // Error-correction level L with mask pattern 0: 111011111000100.
  const formatBits = 0x77c4;
  const coordinates = formatCoordinates();
  for (let index = 0; index < 15; index += 1) {
    const bit = (formatBits >>> index) & 1;
    const [x1, y1] = coordinates[index];
    const [x2, y2] = coordinates[index + 15];
    matrix[y1][x1] = bit;
    matrix[y2][x2] = bit;
  }
  matrix[QR_SIZE - 8][8] = 1;
  return matrix.map((line) => line.map((cell) => cell === 1));
}
