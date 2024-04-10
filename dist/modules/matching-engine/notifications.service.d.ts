import { InstrumentEntity } from 'src/models/entities/instrument.entity';
import { MailService } from 'src/modules/mail/mail.service';
import { CommandOutput, Notification, NOTIFICATION_TYPE } from 'src/modules/matching-engine/matching-engine.const';
import { UserService } from '../user/users.service';
interface Map<T> {
    [key: string]: T;
}
export declare class NotificationService {
    private readonly mailService;
    private readonly userService;
    constructor(mailService: MailService, userService: UserService);
    createNotifications(command: CommandOutput, instruments: Map<InstrumentEntity>): Promise<Notification[]>;
    createPlaceOrderNotification(command: CommandOutput, instruments: Map<InstrumentEntity>): Notification[];
    createOrderMatchedNotifications(command: CommandOutput, instrument: InstrumentEntity): Notification[];
    createCancelOrderNotification(command: CommandOutput, instruments: Map<InstrumentEntity>): Notification;
    createLiquidationNotifications(command: CommandOutput, instruments: Map<InstrumentEntity>): Notification[];
    createWithdrawalNotification(command: CommandOutput): Notification;
    createDepositNotification(command: CommandOutput): Notification;
    genDataNotificationFirebase(type: NOTIFICATION_TYPE, toUserId: number): Promise<import("firebase-admin/lib/messaging/messaging-api").MessagingDevicesResponse>;
}
export {};
