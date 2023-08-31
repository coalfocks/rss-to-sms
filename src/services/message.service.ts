import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import * as nodemailer from 'nodemailer';

@injectable({scope: BindingScope.TRANSIENT})
export class MessageService {
  constructor(/* Add @inject to inject parameters */) {}

  static formatItems(items: any[]) {
     //for now, just add a newline between each item
    return items.join('\n\n');
  }

  getCarrierEmail(carrier: string) {
    switch (carrier) {
        case 'verizon':
            return 'vtext.com';
        case 'att':
            return 'txt.att.net';
        case 'tmobile':
            return 'tmomail.net';
        case 'sprint':
            return 'messaging.sprintpcs.com';
        case 'virgin':
            return 'vmobl.com';
        case 'tracfone':
            return 'mmst5.tracfone.com';
        case 'metropcs':
            return 'mymetropcs.com';
        case 'boost':
            return 'sms.myboostmobile.com';
        case 'cricket':
            return 'sms.cricketwireless.net';
        case 'googlefi':
            return 'msg.fi.google.com';
        case 'mint':
            return 'mailmymobile.net';
    }
  }


  async mailToNumber(number: string, carrier: string, fromAddress: string, message: string) {
    const carrierEmail = this.getCarrierEmail(carrier);
    const toAddress = `${number}@${carrierEmail}`;
    const subject = 'RSS Feed';
    const body = message;
    const transporter = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com',
        port: 465,
        secure: true,
        service: 'yahoo',
        auth: {
            user: fromAddress,
            pass: process.env.GMAIL_PASSWORD,
        },
        logger: true,
    });
    const mailOptions = {
        from: fromAddress,
        to: toAddress,
        subject,
        text: body,
    };
    transporter.sendMail(mailOptions, (error: Error | null, info: any) => {
        if (error) {
            console.log(error);
        } else {
            console.log(`Email sent: ${info.response}`);
            console.log('message: ', JSON.stringify(info));
        }
    });
  }
}
