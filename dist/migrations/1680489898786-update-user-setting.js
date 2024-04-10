"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSetting1680489898786 = void 0;
const typeorm_1 = require("typeorm");
class updateUserSetting1680489898786 {
    async up(queryRunner) {
        await queryRunner.dropColumn('user_settings', 'value');
        await queryRunner.addColumns('user_settings', [
            new typeorm_1.TableColumn({
                name: 'limitOrder',
                type: 'boolean',
                default: '0',
            }),
            new typeorm_1.TableColumn({
                name: 'marketOrder',
                type: 'boolean',
                default: '0',
            }),
            new typeorm_1.TableColumn({
                name: 'stopLimitOrder',
                type: 'boolean',
                default: '0',
            }),
            new typeorm_1.TableColumn({
                name: 'stopMarketOrder',
                type: 'boolean',
                default: '0',
            }),
            new typeorm_1.TableColumn({
                name: 'traillingStopOrder',
                type: 'boolean',
                default: '0',
            }),
            new typeorm_1.TableColumn({
                name: 'takeProfitTrigger',
                type: 'boolean',
                default: '0',
            }),
            new typeorm_1.TableColumn({
                name: 'stopLossTrigger',
                type: 'boolean',
                default: '0',
            }),
            new typeorm_1.TableColumn({
                name: 'fundingFeeTriggerValue',
                type: 'decimal',
                precision: 22,
                scale: 8,
                default: 0,
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'fundingFeeTrigger',
                type: 'boolean',
                default: '0',
            }),
            new typeorm_1.TableColumn({
                name: 'isFavorite',
                type: 'boolean',
                default: '0',
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('user_settings', 'limitOrder');
    }
}
exports.updateUserSetting1680489898786 = updateUserSetting1680489898786;
//# sourceMappingURL=1680489898786-update-user-setting.js.map