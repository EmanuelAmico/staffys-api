import { createTransport } from "nodemailer";
import { envs } from "../config/env/env.config";

const {
  OAUTH2_EMAIL,
  OAUTH2_CLIENT_ID,
  OAUTH2_CLIENT_SECRET,
  OAUTH2_REFRESH_TOKEN,
  OAUTH2_ACCESS_TOKEN,
} = envs;

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  try {
    const transporter = createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: OAUTH2_EMAIL,
        clientId: OAUTH2_CLIENT_ID,
        clientSecret: OAUTH2_CLIENT_SECRET,
        refreshToken: OAUTH2_REFRESH_TOKEN,
        accessToken: OAUTH2_ACCESS_TOKEN,
      },
    });

    const mailOptions = {
      from: OAUTH2_EMAIL,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.warn(`Message sent: ${info.response}`);
  } catch (error) {
    console.error(`Error while sending email: ${error}`);
  }
}
