"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportConfig = exports.masterConfig = void 0;
const index_1 = require("./index");
exports.masterConfig = Object.assign(Object.assign({}, index_1.getConfig().get('master')), { name: 'master', entities: [__dirname + '/../models/entities/**/*{.ts,.js}'], autoLoadEntities: true, loading: true });
exports.reportConfig = Object.assign(Object.assign({}, index_1.getConfig().get('report')), { name: 'report', entities: [__dirname + '/../models/entities/**/*{.ts,.js}'], autoLoadEntities: true, loading: true });
//# sourceMappingURL=database.config.js.map