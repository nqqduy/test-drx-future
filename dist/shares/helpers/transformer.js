"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateTransformer = void 0;
const class_transformer_1 = require("class-transformer");
const dateTransformer = ({ value, type }) => {
    if (!value) {
        return;
    }
    if (type === class_transformer_1.TransformationType.CLASS_TO_PLAIN) {
        return value.getTime();
    }
    else {
        return new Date(value);
    }
};
exports.dateTransformer = dateTransformer;
//# sourceMappingURL=transformer.js.map