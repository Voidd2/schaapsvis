import assert from "node:assert/strict";
import { makeMessage, sendSmtpMail, verifySmtpAuthentication, stuffSmtpData } from "./src/smtp.mjs";

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const server = {
  controller: null,
  greeted: false,
  tls: false,
  inData: false,
  lines: [],
  message: "",
  authCode: "235",
};

function reply(text) {
  server.controller.enqueue(encoder.encode(text));
}

function socket() {
  const readable = new ReadableStream({
    start(controller) {
      server.controller = controller;
      if (!server.greeted) {
        server.greeted = true;
        reply("220 smtp.test ESMTP\r\n");
      }
    },
  });
  let buffered = "";
  const writable = new WritableStream({
    write(chunk) {
      buffered += decoder.decode(chunk, { stream: true });
      while (buffered.includes("\r\n")) {
        const end = buffered.indexOf("\r\n");
        const line = buffered.slice(0, end);
        buffered = buffered.slice(end + 2);
        if (server.inData) {
          if (line === ".") {
            server.inData = false;
            reply("250 queued\r\n");
          } else {
            server.message += line + "\r\n";
          }
          continue;
        }
        server.lines.push({ line, tls: server.tls });
        if (line.startsWith("EHLO ")) reply("250-smtp.test\r\n250-STARTTLS\r\n250 AUTH PLAIN\r\n");
        else if (line === "STARTTLS") reply("220 go ahead\r\n");
        else if (line.startsWith("AUTH PLAIN ")) reply(`${server.authCode} authenticated\r\n`);
        else if (line.startsWith("MAIL FROM:")) reply("250 sender ok\r\n");
        else if (line.startsWith("RCPT TO:")) reply("250 recipient ok\r\n");
        else if (line === "DATA") { server.inData = true; reply("354 send data\r\n"); }
        else if (line === "QUIT") reply("221 bye\r\n");
        else throw new Error("Unexpected SMTP command: " + line);
      }
    },
  });
  return {
    readable,
    writable,
    startTls() { server.tls = true; return socket(); },
    async close() {},
  };
}

await sendSmtpMail({
  SMTP_HOST: "smtp.example.test",
  SMTP_PORT: "587",
  SMTP_USERNAME: "schaapsv@schaapsvishandel.nl",
  SMTP_PASSWORD: "test-secret",
  MAIL_FROM: "schaapsv@schaapsvishandel.nl",
}, {
  to: "student@example.test",
  subject: "Bevestig uw e-mailadres — Schaap's",
  text: "Uw code is 012345.",
  html: "<p>Uw code is <strong>012345</strong>.</p>",
}, () => socket());

assert.equal(server.tls, true, "authentication and content must be sent only after STARTTLS");
assert(server.lines.some(({ line, tls }) => line === "EHLO mail.schaapsvishandel.nl" && !tls));
assert(server.lines.some(({ line, tls }) => line === "EHLO mail.schaapsvishandel.nl" && tls));
assert(server.lines.some(({ line, tls }) => line === "STARTTLS" && !tls));
assert(server.lines.some(({ line, tls }) => line.startsWith("AUTH PLAIN ") && tls));
assert(server.lines.some(({ line, tls }) => line.startsWith("MAIL FROM:<schaapsv@schaapsvishandel.nl>") && tls));
assert(server.lines.some(({ line, tls }) => line.startsWith("RCPT TO:<student@example.test>") && tls));
assert(server.message.includes("Content-Type: text/plain; charset=UTF-8"));
assert(server.message.includes("Content-Type: text/html; charset=UTF-8"));
assert(server.message.includes("=?UTF-8?B?"));
assert(!server.message.includes("test-secret"), "the SMTP password must never appear in message data");

function decodedSender(message) {
  const fromLines = message.replace(/\r\n[ \t]+/g, " ").split("\r\n").filter((line) => line.startsWith("From: "));
  assert.equal(fromLines.length, 1, "exactly one visible sender header");
  const match = fromLines[0].match(/^From: =\?UTF-8\?B\?([^?]+)\?= <([^<>]+)>$/);
  assert(match, "display name must be encoded separately from the single mailbox");
  return { name: Buffer.from(match[1], "base64").toString("utf8"), address: match[2] };
}
assert.deepEqual(decodedSender(server.message), { name: "Schaap’s Vishandel – Accounts", address: "schaapsv@schaapsvishandel.nl" });

const campaignMessage = makeMessage({
  from: "schaapsv@schaapsvishandel.nl",
  to: "customer@example.test",
  subject: "Aanbieding",
  text: "Een aanbieding.",
  html: "<p>Een aanbieding.</p>",
  listUnsubscribeUrl: "https://schaapsvishandel.nl/api/members/newsletter/unsubscribe-one-click?token=test-token",
});
assert.match(campaignMessage.body, /List-Unsubscribe: <https:\/\/schaapsvishandel\.nl\/api\/members\/newsletter\/unsubscribe-one-click\?token=test-token>/);
assert.match(campaignMessage.body, /List-Unsubscribe-Post: List-Unsubscribe=One-Click/);
assert.deepEqual(decodedSender(campaignMessage.body), { name: "Schaap’s Vishandel – Aanbiedingen", address: "schaapsv@schaapsvishandel.nl" });
assert.equal(campaignMessage.from, "schaapsv@schaapsvishandel.nl", "the SMTP envelope remains the authenticated mailbox");

// Exercise actual multilingual subjects, long campaign subjects and UTF-8
// boundaries. Decode each word independently so split byte sequences fail.
for (const subject of [
  "Bevestig uw persoonlijke e-mailadres — Schaap's Vishandel",
  "Verify your personal email — Schaap's Vishandel",
  "Private E-Mail bestätigen — Schaap's Vishandel",
  "Vis voor de feestdagen ".repeat(12),
  "🐟é漢".repeat(40),
  "A".repeat(250),
  "Test\r\nBcc: nobody@example.test",
]) {
  const message = makeMessage({ from: "schaapsv@schaapsvishandel.nl", to: "customer@example.test", subject, text: "Test", html: "<p>Test</p>" }).body;
  const header = message.split("\r\n\r\n")[0];
  const subjectHeader = header.match(/^Subject: ([^\r\n]*(?:\r\n[ \t][^\r\n]*)*)/m)[1];
  const words = [...subjectHeader.matchAll(/=\?UTF-8\?B\?([^?]+)\?=/g)];
  for (const word of words) assert(word[0].length <= 75, "RFC 2047 encoded-word length");
  for (const line of header.split("\r\n").filter((line) => line.includes("=?UTF-8?B?"))) assert(line.length <= 76, "RFC 2047 encoded header line length");
  const decoded = words.length ? words.map((word) => new TextDecoder("utf-8", { fatal: true }).decode(Buffer.from(word[1], "base64"))).join("") : subjectHeader;
  assert.equal(decoded, subject.replace(/[\r\n]/g, " "), "folding preserves the exact subject without breaking Unicode");
  assert(!/^Bcc:/m.test(header), "subject cannot inject another header");
}
assert.throws(() => makeMessage({ from: "schaapsv@schaapsvishandel.nl", to: "customer@example.test", subject: "Test", text: "Test", html: "<p>Test</p>", listUnsubscribeUrl: "http://example.test/unsubscribe" }), /invalid-list-unsubscribe-url/);

server.greeted = false;
server.tls = false;
server.inData = false;
server.lines = [];
server.message = "";
await verifySmtpAuthentication({
  SMTP_HOST: "smtp.example.test",
  SMTP_PORT: "587",
  SMTP_USERNAME: "schaapsv@schaapsvishandel.nl",
  SMTP_PASSWORD: "test-secret",
  MAIL_FROM: "schaapsv@schaapsvishandel.nl",
}, () => socket());
assert(server.lines.some(({ line, tls }) => line === "EHLO mail.schaapsvishandel.nl" && !tls));
assert(server.lines.some(({ line, tls }) => line === "EHLO mail.schaapsvishandel.nl" && tls));
assert(server.lines.some(({ line, tls }) => line === "STARTTLS" && !tls));
assert(server.lines.some(({ line, tls }) => line.startsWith("AUTH PLAIN ") && tls));
assert(!server.lines.some(({ line }) => /^(MAIL FROM:|RCPT TO:|DATA)$/.test(line)), "SMTP health check must never submit a message");

server.greeted = false;
server.tls = false;
server.inData = false;
server.lines = [];
server.message = "";
server.authCode = "535";
await assert.rejects(
  verifySmtpAuthentication({
    SMTP_HOST: "smtp.example.test",
    SMTP_PORT: "587",
    SMTP_USERNAME: "schaapsv@schaapsvishandel.nl",
    SMTP_PASSWORD: "test-secret",
    MAIL_FROM: "schaapsv@schaapsvishandel.nl",
  }, () => socket()),
  /smtp-check-auth-smtp-command-rejected-535/,
);
assert(!server.lines.some(({ line }) => /^(MAIL FROM:|RCPT TO:|DATA)$/.test(line)), "failed SMTP authentication must not submit a message");
await assert.rejects(
  verifySmtpAuthentication({
    SMTP_HOST: "smtp.example.test",
    SMTP_PORT: "587",
    SMTP_USERNAME: "schaapsv@schaapsvishandel.nl",
    SMTP_PASSWORD: "test-secret",
    MAIL_FROM: "schaapsv@schaapsvishandel.nl",
  }, () => { throw new Error("network failure"); }),
  /smtp-check-connect-smtp-connection-failed/,
);
server.authCode = "235";
server.authCode = "235";

assert.equal(stuffSmtpData("header\r\n.dot\r\n..dot"), "header\r\n..dot\r\n...dot", "SMTP dot-stuffing preserves line boundaries");
console.log("Knoth SMTP integration test passed: STARTTLS, PLAIN authentication and UTF-8 multipart email.");
