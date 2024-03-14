import nodemailer from "nodemailer";
import { ApiError } from "./ApiError.js";
import { response } from "express";
const EmailSend = async (email, subject, text) => {
    console.log(process.env.GMAIL_PASSWORD)
  try {
    const transporter = nodemailer.createTransport({
      host: "Smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `'MtPizza' <${process.env.GMAIL_USER}>`,
      to: email, //
      subject: subject,
      text: text,
    });



    return response
  } catch (error) {
    return null
  }
};

export { EmailSend };
