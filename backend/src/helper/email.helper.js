const nodemailer = require("nodemailer");
const { SMTPConfig } = require("../config/config");
const { SimpleConsoleLogger } = require("typeorm");

class EmailService {
  #transport;
  constructor() {
    try {
      this.#transport = nodemailer.createTransport({
        host: SMTPConfig.host,
        port: SMTPConfig.port,
        service: SMTPConfig.provider,
        auth: {
          user: SMTPConfig.user,
          pass: SMTPConfig.password,
        },
      });
    } catch (exception) {
      throw exception;
    }
  }

  emailSend = async ({
    to,
    subject,
    message,
    cc = null,
    bcc = null,
    attachments = null,
  }) => {
    try {
      let messageBag = {
        to: to,
        subject: subject,
        from: SMTPConfig.fromAddress,
        html: message,
      };
      if (cc) {
        messageBag.cc = cc;
      }
      if (bcc) {
        messageBag.bcc = bcc;
      }
      if (attachments) {
        messageBag.attachments = attachments;
      }
      return await this.#transport.sendMail(messageBag);
    } catch (exception) {
      throw exception;
    }
  };
}

module.exports = EmailService;
