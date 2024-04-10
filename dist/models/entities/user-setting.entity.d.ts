export declare class UserSettingEntity {
    static NOTIFICATION: string;
    id: number;
    userId: number;
    key: string;
    limitOrder: boolean;
    marketOrder: boolean;
    stopLimitOrder: boolean;
    stopMarketOrder: boolean;
    traillingStopOrder: boolean;
    takeProfitTrigger: boolean;
    stopLossTrigger: boolean;
    fundingFeeTriggerValue: number;
    fundingFeeTrigger: boolean;
    isFavorite: boolean;
    time: Date;
    notificationQuantity: number;
    createdAt: Date;
    updatedAt: Date;
}
