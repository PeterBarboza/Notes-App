import nodemailer, { Transporter } from "nodemailer"

import { apiMainLogger } from "../../app"
import { CONFIG } from "../../configs"

type sendMailParams = {
  to: string,
  subject: string,
  text: string,
  html: string,
}

type nodemailerSendMailReturn = {
  accepted: string[]
  rejected: string[]
}

export class EmailServices {
  private INSTANCE: Transporter | null = null

  constructor() {
    this.INSTANCE = this.getInstance()
  }

  private getInstance() {
    if(!this.INSTANCE) {
      this.INSTANCE = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
          user: CONFIG.nodemailer.user,
          pass: CONFIG.nodemailer.pass,
        }
      });
    }

    return this.INSTANCE
  }

  async sendMail({ to, subject, text, html }: sendMailParams) {
    try {
      const info: nodemailerSendMailReturn = await this.getInstance().sendMail({
        from: CONFIG.nodemailer.sender,
        to: to,
        subject: subject,
        text: text,
        html: html
      });
      
      if(info?.accepted?.find(item => item === to)) {
        return { received: true }
      }

      return { message: "Unknown error" }
    } catch (error) {
      apiMainLogger("Error on send mail")
      apiMainLogger(error)

      return { message: "Unknown error" }
    }
  }
}