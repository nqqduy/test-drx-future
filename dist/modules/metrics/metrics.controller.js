"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const prom_client_1 = require("prom-client");
const metrics_service_1 = require("./metrics.service");
let MetricsController = class MetricsController {
    constructor(registry, metricService) {
        this.registry = registry;
        this.metricService = metricService;
    }
    async getMetrics() {
        this.registry.clear();
        const data = await this.metricService.healthcheckService();
        const queue = await this.metricService.healcheckRedis();
        this.myGauge1 = new prom_client_1.Gauge({
            name: 'future_healthcheck',
            help: 'Check healthcheck service from furure',
            labelNames: ['name'],
            registers: [this.registry],
        });
        this.myGauge2 = new prom_client_1.Gauge({
            name: 'future_count_process_queue',
            help: 'Count queue from furure',
            labelNames: ['name'],
            registers: [this.registry],
        });
        this.myGauge1.set({ name: 'get_funding' }, data.healthcheck_get_funding ? 1 : 0);
        this.myGauge1.set({ name: 'pay_funding' }, data.healthcheck_pay_funding ? 1 : 0);
        this.myGauge1.set({ name: 'index_price' }, data.healthcheck_index_price ? 1 : 0);
        this.myGauge1.set({ name: 'coin_info' }, data.healthcheck_coin_info ? 1 : 0);
        this.myGauge1.set({ name: 'sync_candle' }, data.healthcheck_sync_candle ? 1 : 0);
        this.myGauge1.set({ name: 'process_queue' }, queue <= 500 ? 1 : 0);
        this.myGauge2.set({ name: 'total_queue' }, queue);
        this.registry.registerMetric(this.myGauge1);
        const result = this.registry.metrics();
        return result;
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MetricsController.prototype, "getMetrics", null);
MetricsController = tslib_1.__decorate([
    common_1.Controller('metric'),
    tslib_1.__param(0, common_1.Inject('PROM_REGISTRY')),
    tslib_1.__metadata("design:paramtypes", [prom_client_1.Registry,
        metrics_service_1.MetricsService])
], MetricsController);
exports.MetricsController = MetricsController;
//# sourceMappingURL=metrics.controller.js.map