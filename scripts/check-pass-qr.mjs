import assert from 'node:assert/strict';
import jsQR from 'jsqr';
import { qrMatrix } from '../src/lib/qr.ts';

// Decode with a separate implementation, not the encoder being tested.
const payload = Buffer.from(JSON.stringify({ p: '11111111-2222-4333-8444-555555555555', e: 1800000000000, n: 'aBcDeFgHiJkL' })).toString('base64url');
const token = `SVQ1.${payload}.${'a'.repeat(43)}`;
for (const value of ['SV-TEST12', token, `SVQ1.${'x'.repeat(500)}`]) {
  const matrix = qrMatrix(value), scale = 6, quiet = 4;
  const size = (matrix.length + quiet * 2) * scale;
  const pixels = new Uint8ClampedArray(size * size * 4).fill(255);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const my = Math.floor(y / scale) - quiet, mx = Math.floor(x / scale) - quiet;
    if (matrix[my]?.[mx]) { const i = (y * size + x) * 4; pixels[i] = pixels[i + 1] = pixels[i + 2] = 0; }
  }
  assert.equal(jsQR(pixels, size, size)?.data, value, 'QR decodes to the complete, unchanged token');
}
console.log('QR round-trip checks passed: short code, production-shaped signed token, 500-byte payload.');
