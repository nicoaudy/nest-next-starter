import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private confirmationTemplate: handlebars.TemplateDelegate;

  constructor() {
    this.transporter = nodemailer.createTransport(
      {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: process.env.MAILER_SECURE === 'true',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      {
        from: {
          name: 'No-reply',
          address: process.env.MAIL_FROM,
        },
      },
    );

    // Load Handlebars templates
    this.confirmationTemplate = this.loadTemplate('confirmation.hbs');
  }

  private loadTemplate(templateName: string): handlebars.TemplateDelegate {
    const templatesFolderPath = path.join(__dirname, 'templates');
    const templatePath = path.join(templatesFolderPath, templateName);
    const templateSource = fs.readFileSync(templatePath, 'utf8');

    return handlebars.compile(templateSource);
  }

  async sendUserConfirmation(user: User, token: string) {
    const url = `${process.env.VERIFICATION_URL}?token=${token}`;
    const html = this.confirmationTemplate({ name: user.name, url });

    await this.transporter.sendMail({
      to: user.email,
      subject: 'Welcome user! Confirm your Email',
      html: html,
    });
  }
}
