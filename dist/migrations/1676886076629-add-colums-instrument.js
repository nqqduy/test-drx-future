"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addColumsInstrument1676886076629 = void 0;
const typeorm_1 = require("typeorm");
class addColumsInstrument1676886076629 {
    async up(queryRunner) {
        await queryRunner.addColumns('instruments', [
            new typeorm_1.TableColumn({
                name: 'minPriceMovement',
                type: 'decimal',
                precision: 22,
                scale: 8,
                default: 0,
            }),
            new typeorm_1.TableColumn({
                name: 'maxFiguresForSize',
                type: 'decimal',
                precision: 22,
                scale: 8,
                default: 0,
            }),
            new typeorm_1.TableColumn({
                name: 'maxFiguresForPrice',
                type: 'decimal',
                precision: 22,
                scale: 8,
                default: 0,
            }),
            new typeorm_1.TableColumn({
                name: 'impactMarginNotional',
                type: 'decimal',
                precision: 22,
                scale: 8,
                default: 0,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('instruments', 'minPriceMovement');
        await queryRunner.dropColumn('instruments', 'maxFiguresForSize');
        await queryRunner.dropColumn('instruments', 'maxFiguresForPrice');
        await queryRunner.dropColumn('instruments', 'impactMarginNotional');
    }
}
exports.addColumsInstrument1676886076629 = addColumsInstrument1676886076629;
//# sourceMappingURL=1676886076629-add-colums-instrument.js.map