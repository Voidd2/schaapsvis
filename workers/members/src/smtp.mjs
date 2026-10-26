const encoder = new TextEncoder();
const decoder = new TextDecoder();

function mailbox(value) {
  const email = String(value || "").trim();
  if (!/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(email)) throw new Error("invalid-mailbox");
  return email;
}

function utf8Base64(value) {
  const bytes = encoder.encode(String(value));
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}

function wrapBase64(value) {
  return value.match(/.{1,76}/g)?.join("\r\n") || "";
}

export function stuffSmtpData(body) {
  return String(body).replace(/(^|\r\n)\./g, "$1..");
}

function encodedHeader(value) {
  const clean = String(value || "").replace(/[\r\n]/g, " ");
  return /^[\x20-\x7e]*$/.test(clean) ? clean : `=?UTF-8?B?${utf8Base64(clean)}?=`;
}

function makeMessage({ from, to, subject, text, html }) {
  const fromAddress = mailbox(from);
  const toAddress = mailbox(to);
  const boundary = `sv-${crypto.randomUUID()}`;
  const domain = fromAddress.split("@").at(-1);
  const body = [
    `From: ${fromAddress}`,
    `To: ${toAddress}`,
    `Subject: ${encodedHeader(subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@${domain}>`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary=\"${boundary}\"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    wrapBase64(utf8Base64(text)),
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    wrapBase64(utf8Base64(html)),
    `--${boundary}--`,
    "",
  ].join("\r\n");
  return { from: fromAddress, to: toAddress, body };
}

class SmtpSession {
  constructor(socket) {
    this.socket = socket;
    this.reader = socket.readable.getReader();
    this.writer = socket.writable.getWriter();
    this.buffer = "";
  }

  async write(value) {
    await this.writer.write(encoder.encode(value));
  }

  async line() {
    while (true) {
      const newline = this.buffer.indexOf("\n");
      if (newline >= 0) {
        const result = this.buffer.slice(0, newline).replace(/\r$/, "");
        this.buffer = this.buffer.slice(newline + 1);
        return result;
      }
      const { value, done } = await this.reader.read();
      if (done) throw new Error("smtp-connection-closed");
      this.buffer += decoder.decode(value, { stream: true });
    }
  }

  async reply() {
    const lines = [];
    let code;
    while (true) {
      const line = await this.line();
      const match = /^(\d{3})([ -])(.*)$/.exec(line);
      if (!match) throw new Error("smtp-invalid-response");
      if (!code) code = match[1];
      if (match[1] !== code) throw new Error("smtp-invalid-response");
      lines.push(line);
      if (match[2] === " ") return { code, lines };
    }
  }

  async command(value, expectedCodes) {
    await this.write(`${value}\r\n`);
    const response = await this.reply();
    if (!expectedCodes.includes(response.code)) throw new Error(`smtp-command-rejected-${response.code}`);
    return response;
  }

  async upgradeToTls() {
    this.reader.releaseLock();
    this.writer.releaseLock();
    this.socket = this.socket.startTls();
    this.reader = this.socket.readable.getReader();
    this.writer = this.socket.writable.getWriter();
    this.buffer = "";
  }

  async close() {
    try { this.reader.releaseLock(); } catch {}
    try { this.writer.releaseLock(); } catch {}
    try { await this.socket.close(); } catch {}
  }
}

/**
 * Send one message through an authenticated Knoth-compatible SMTP submission endpoint.
 * `connectSocket` is injectable solely so the protocol can be integration-tested in Node.
 */
export async function sendSmtpMail(env, message, connectSocket) {
  const host = String(env.SMTP_HOST || "").trim();
  const port = Number(env.SMTP_PORT || 587);
  const username = String(env.SMTP_USERNAME || "").trim();
  const password = String(env.SMTP_PASSWORD || "");
  if (!host || !username || !password || !env.MAIL_FROM) throw new Error("mail-not-configured");
  if (!/^[a-z0-9.-]+$/i.test(host) || ![465, 587].includes(port)) throw new Error("smtp-invalid-config");
  const connect = connectSocket;
  if (typeof connect !== "function") throw new Error("smtp-connector-missing");
  const messageParts = makeMessage({ from: env.MAIL_FROM, to: message.to, ...message });
  const socket = connect({ hostname: host, port }, { secureTransport: port === 465 ? "on" : "starttls" });
  const session = new SmtpSession(socket);

  try {
    const greeting = await session.reply();
    if (greeting.code !== "220") throw new Error(`smtp-greeting-rejected-${greeting.code}`);
    const ehlo = `EHLO ${env.SMTP_HELO_NAME || "schaapsvishandel.nl"}`;
    let capabilities = await session.command(ehlo, ["250"]);
    if (port === 587) {
      if (!capabilities.lines.some((line) => /\bSTARTTLS\b/i.test(line))) throw new Error("smtp-starttls-unavailable");
      await session.command("STARTTLS", ["220"]);
      await session.upgradeToTls();
      capabilities = await session.command(ehlo, ["250"]);
    }
    if (!capabilities.lines.some((line) => /\bAUTH\b.*\bPLAIN\b/i.test(line))) throw new Error("smtp-auth-plain-unavailable");
    await session.command(`AUTH PLAIN ${utf8Base64(`\0${username}\0${password}`)}`, ["235"]);
    await session.command(`MAIL FROM:<${messageParts.from}>`, ["250"]);
    await session.command(`RCPT TO:<${messageParts.to}>`, ["250", "251"]);
    await session.command("DATA", ["354"]);
    // SMTP DATA dot-stuffing prefixes an extra dot on the same line. Do not
    // introduce a new line; that would alter message contents when a future
    // MIME part uses a non-base64 transfer encoding.
    const stuffedBody = stuffSmtpData(messageParts.body);
    await session.write(`${stuffedBody}\r\n.\r\n`);
    await session.reply().then((response) => {
      if (response.code !== "250") throw new Error(`smtp-message-rejected-${response.code}`);
    });
    try { await session.command("QUIT", ["221"]); } catch {}
  } finally {
    if (session) await session.close();
  }
}

/**
 * Verify Knoth SMTP connectivity and credentials without submitting a message.
 * Only stable, sanitized error codes are propagated for an owner-only diagnostic.
 */
export async function verifySmtpAuthentication(env, connectSocket) {
  const host = String(env.SMTP_HOST || "").trim();
  const port = Number(env.SMTP_PORT || 587);
  const username = String(env.SMTP_USERNAME || "").trim();
  const password = String(env.SMTP_PASSWORD || "");
  if (!host || !username || !password || !env.MAIL_FROM) throw new Error("smtp-check-not-configured");
  if (!/^[a-z0-9.-]+$/i.test(host) || ![465, 587].includes(port)) throw new Error("smtp-check-invalid-config");
  if (typeof connectSocket !== "function") throw new Error("smtp-check-connector-missing");

  let session;
  let stage = "connect";
  try {
    const socket = connectSocket({ hostname: host, port }, { secureTransport: port === 465 ? "on" : "starttls" });
    session = new SmtpSession(socket);
    stage = "greeting";
    const greeting = await session.reply();
    if (greeting.code !== "220") throw new Error(`smtp-greeting-rejected-${greeting.code}`);
    const ehlo = `EHLO ${env.SMTP_HELO_NAME || "schaapsvishandel.nl"}`;
    stage = "ehlo";
    let capabilities = await session.command(ehlo, ["250"]);
    if (port === 587) {
      if (!capabilities.lines.some((line) => /\bSTARTTLS\b/i.test(line))) throw new Error("smtp-starttls-unavailable");
      stage = "starttls";
      await session.command("STARTTLS", ["220"]);
      await session.upgradeToTls();
      stage = "tls-ehlo";
      capabilities = await session.command(ehlo, ["250"]);
    }
    if (!capabilities.lines.some((line) => /\bAUTH\b.*\bPLAIN\b/i.test(line))) throw new Error("smtp-auth-plain-unavailable");
    stage = "auth";
    await session.command(`AUTH PLAIN ${utf8Base64(`\0${username}\0${password}`)}`, ["235"]);
    return { status: "authenticated" };
  } catch (error) {
    const cause = typeof error?.message === "string" && /^smtp-[a-z0-9-]{1,80}$/.test(error.message)
      ? error.message
      : "smtp-connection-failed";
    throw new Error(`smtp-check-${stage}-${cause}`);
  } finally {
    if (session) await session.close();
  }
}
