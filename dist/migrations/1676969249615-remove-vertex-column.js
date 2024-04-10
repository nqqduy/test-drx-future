"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeVertexColumn1676969249615 = void 0;
class removeVertexColumn1676969249615 {
    async up(queryRunner) {
        await queryRunner.dropColumns('orders', ['vertexPrice', 'trailValue']);
    }
    async down() { }
}
exports.removeVertexColumn1676969249615 = removeVertexColumn1676969249615;
//# sourceMappingURL=1676969249615-remove-vertex-column.js.map