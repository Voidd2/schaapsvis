import { connect } from "cloudflare:sockets";
import { sendSmtpMail as send, verifySmtpAuthentication as verify } from "./smtp.mjs";

export function sendSmtpMail(env, message) {
  return send(env, message, connect);
}

export function verifySmtpAuthentication(env) {
  return verify(env, connect);
}
