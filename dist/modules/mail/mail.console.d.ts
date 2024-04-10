import { MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';
import { MailService } from 'src/modules/mail/mail.service';
export declare class MailConsole {
    private mailerService;
    private readonly mailService;
    private readonly logger;
    constructor(mailerService: MailerService, mailService: MailService, logger: Logger);
    sendMail(email: string, subject: string, body: string): Promise<void>;
    sendMailViaQueue(email: string, subject: string, body: string): Promise<void>;
}
