import nodemailer, { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

interface IMailOptions {
  to: string;
  subject: string;
  text: string;
}

class NodemailerService {
  isReady: boolean = false;
  private transporter: Transporter;

  private setIsReady(state: boolean) {
    this.isReady = state;
  }

  initialize() {
    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.MAIL_GUN_HOST,
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL_GUN_USERNAME,
          pass: process.env.MAIL_GUN_PASSWORD,
        },
      });
      this.setIsReady(true);
      console.log('📧 =>> Server is ready to take our messages');
    } catch (error) {
      console.log('📌 =>> Server is not ready to send mail');
    }
  }

  sendMailTo(
    mailOption: IMailOptions,
    callback: (err: Error, info: any) => void
  ) {
    try {
      const mail: Mail.Options = {
        ...mailOption,
        from: process.env.MAIL_GUN_USERNAME,
      };
      return this.transporter.sendMail(mail, callback);
    } catch (error) {
      throw error;
    }
  }
}

const instance = new NodemailerService();

export default instance;
