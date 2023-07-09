import { createTransport } from "nodemailer";
import { envs } from "../config/env/env.config";
import { google } from "googleapis";
import { APIError } from "./error.utils";
const OAuth2 = google.auth.OAuth2;

const {
  OAUTH2_EMAIL,
  OAUTH2_CLIENT_ID,
  OAUTH2_CLIENT_SECRET,
  OAUTH2_REFRESH_TOKEN,
  OAUTH2_ACCESS_TOKEN,
} = envs;

const OAuth2Client = new OAuth2(
  OAUTH2_CLIENT_ID,
  OAUTH2_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

OAuth2Client.setCredentials({
  refresh_token: OAUTH2_REFRESH_TOKEN,
  access_token: OAUTH2_ACCESS_TOKEN,
});

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
    const { token: accessToken } = await OAuth2Client.getAccessToken();

    if (!accessToken)
      throw new APIError({
        message: "Error while getting access token",
        status: 500,
      });

    const transporter = createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: OAUTH2_EMAIL,
        clientId: OAUTH2_CLIENT_ID,
        clientSecret: OAUTH2_CLIENT_SECRET,
        refreshToken: OAUTH2_REFRESH_TOKEN,
        accessToken,
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

    return info;
  } catch (error) {
    throw new APIError({
      message: `Error while sending email: ${error}`,
      status: 500,
    });
  }
}
