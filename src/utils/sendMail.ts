import nodemailer, { SentMessageInfo } from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";
import { catchError } from ".";
dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const transporter = async () => {
  const accessToken = await oAuth2Client.getAccessToken();
  return nodemailer.createTransport({
    //@ts-ignore
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USERNAME,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });
};

async function sendEmail(options: any): Promise<SentMessageInfo> {
  const transporterObj = await transporter();

  const [err, data] = await catchError(
    transporterObj.sendMail({
      from: process.env.EMAIL_USER,
      to: options.email,
      subject: options.subject,
      text: options.message,
    })
  );

  if (data) console.log("message sent: ", data.messageId);

  else console.log("error sending email: ", err);
  
  return [err, data];
}

export default sendEmail;
