"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslateModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const nestjs_i18n_1 = require("nestjs-i18n");
const users_module_1 = require("../user/users.module");
const translate_service_1 = require("./translate.service");
let TranslateModule = class TranslateModule {
};
TranslateModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            nestjs_i18n_1.I18nModule.forRoot({
                fallbackLanguage: 'en',
                parser: nestjs_i18n_1.I18nJsonParser,
                parserOptions: {
                    path: 'dist/i18n/',
                },
                resolvers: [
                    {
                        use: nestjs_i18n_1.QueryResolver,
                        options: ['lang', 'locale', 'l'],
                    },
                    nestjs_i18n_1.AcceptLanguageResolver,
                    new nestjs_i18n_1.CookieResolver(['lang', 'locale', 'l']),
                ],
            }),
            common_1.forwardRef(() => users_module_1.UsersModule),
        ],
        providers: [translate_service_1.TranslateService],
        exports: [translate_service_1.TranslateService],
    })
], TranslateModule);
exports.TranslateModule = TranslateModule;
//# sourceMappingURL=translate.module.js.map