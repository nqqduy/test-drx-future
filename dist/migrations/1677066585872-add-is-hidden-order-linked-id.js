"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addIsHiddenOrderLinkedId1677066585872 = void 0;
const typeorm_1 = require("typeorm");
class addIsHiddenOrderLinkedId1677066585872 {
    async up(queryRunner) {
        await queryRunner.addColumns('orders', [
            new typeorm_1.TableColumn({
                name: 'linkedOrderId',
                type: 'int',
                unsigned: true,
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'isHidden',
                type: 'boolean',
                isNullable: true,
            }),
        ]);
    }
    async down() { }
}
exports.addIsHiddenOrderLinkedId1677066585872 = addIsHiddenOrderLinkedId1677066585872;
//# sourceMappingURL=1677066585872-add-is-hidden-order-linked-id.js.map