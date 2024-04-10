"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const index_service_1 = require("./index.service");
let IndexController = class IndexController {
    constructor(indexService) {
        this.indexService = indexService;
    }
    async fakeMarkPrice(markPrice, symbol) {
        return await this.indexService.fakeMarkPrice(markPrice, symbol);
    }
};
tslib_1.__decorate([
    common_1.Get('/fake-mark-price'),
    swagger_1.ApiQuery({
        name: 'markPrice',
        example: 100,
        required: true,
    }),
    swagger_1.ApiQuery({
        name: 'symbol',
        example: 'UNIUSD',
        required: true,
    }),
    tslib_1.__param(0, common_1.Query('markPrice')), tslib_1.__param(1, common_1.Query('symbol')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], IndexController.prototype, "fakeMarkPrice", null);
IndexController = tslib_1.__decorate([
    common_1.Controller('index'),
    swagger_1.ApiTags('Fake price'),
    tslib_1.__metadata("design:paramtypes", [index_service_1.IndexService])
], IndexController);
exports.IndexController = IndexController;
//# sourceMappingURL=index.controller.js.map