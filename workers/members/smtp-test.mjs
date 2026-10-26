import assert from "node:assert/strict";
import { sendSmtpMail, stuffSmtpData } from "./src/smtp.mjs";

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const server = {
  controller: null,
  greeted: false,
  tls: false,
  inData: false,
  lines: [],
  message: "",
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
        else if (line.startsWith("AUTH PLAIN ")) reply("235 authenticated\r\n");
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
assert(server.lines.some(({ line, tls }) => line === "STARTTLS" && !tls));
assert(server.lines.some(({ line, tls }) => line.startsWith("AUTH PLAIN ") && tls));
assert(server.lines.some(({ line, tls }) => line.startsWith("MAIL FROM:<schaapsv@schaapsvishandel.nl>") && tls));
assert(server.lines.some(({ line, tls }) => line.startsWith("RCPT TO:<student@example.test>") && tls));
assert(server.message.includes("Content-Type: text/plain; charset=UTF-8"));
assert(server.message.includes("Content-Type: text/html; charset=UTF-8"));
assert(server.message.includes("=?UTF-8?B?"));
assert(!server.message.includes("test-secret"), "the SMTP password must never appear in message data");
assert.equal(stuffSmtpData("header\r\n.dot\r\n..dot"), "header\r\n..dot\r\n...dot", "SMTP dot-stuffing preserves line boundaries");
console.log("Knoth SMTP integration test passed: STARTTLS, PLAIN authentication and UTF-8 multipart email.");
