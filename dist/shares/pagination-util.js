"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryLimit = void 0;
const pagination_dto_1 = require("./dtos/pagination.dto");
const getQueryLimit = (paginationDto, maxResultCount) => {
    const offset = paginationDto.size * (paginationDto.page - 1);
    const limit = paginationDto.size;
    return { offset, limit };
};
exports.getQueryLimit = getQueryLimit;
//# sourceMappingURL=pagination-util.js.map