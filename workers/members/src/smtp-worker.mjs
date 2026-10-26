import { connect } from "cloudflare:sockets";
import { sendSmtpMail as send } from "./smtp.mjs";

export function sendSmtpMail(env, message) {
  return send(env, message, connect);
}
