"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslateService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const nestjs_i18n_1 = require("nestjs-i18n");
const user_entity_1 = require("../../models/entities/user.entity");
let TranslateService = class TranslateService {
    constructor(i18n) {
        this.i18n = i18n;
    }
    async translate(user, key, args) {
        let lang = '';
        switch (user.location) {
            case 'vi': {
                lang = 'vi';
                break;
            }
            case 'ko': {
                lang = 'kr';
                break;
            }
            default:
                lang = 'en';
                break;
        }
        return await this.i18n.translate(`translate.${key}`, {
            lang,
            args,
        });
    }
};
TranslateService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [nestjs_i18n_1.I18nService])
], TranslateService);
exports.TranslateService = TranslateService;
//# sourceMappingURL=translate.service.js.map