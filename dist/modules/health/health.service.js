"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const redis_1 = require("redis");
const kafka_1 = require("../../configs/kafka");
const redis_config_1 = require("../../configs/redis.config");
const typeorm_2 = require("typeorm");
let HealthService = class HealthService {
    constructor(reportConnection, masterConnection, logger) {
        this.reportConnection = reportConnection;
        this.masterConnection = masterConnection;
        this.logger = logger;
    }
    async getHealth() {
        const redisClient = redis_1.createClient(redis_config_1.redisConfig.port, redis_config_1.redisConfig.host);
        const check = () => {
            return new Promise((resolve, _reject) => {
                redisClient.set('health', `${new Date().getTime()}`, (err, data) => {
                    if (err) {
                        throw new common_1.HttpException('Failed check health redis', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                    else if (data) {
                        resolve('Success check health redis');
                    }
                    else {
                        throw new common_1.HttpException('Failed check health redis', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                });
            });
        };
        const redis = await check();
        redisClient.quit();
        const query = 'SELECT 1';
        let mysql;
        try {
            Promise.all([this.masterConnection.query(query), this.reportConnection.query(query)]);
            mysql = 'Success check health mysql';
        }
        catch (e) {
            this.logger.error(e);
            throw new common_1.HttpException('Failed check health mysql', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        let _kafka;
        const consumer = kafka_1.kafka.consumer({ groupId: 'checkhealth' });
        const producer = kafka_1.kafka.producer();
        try {
            await consumer.connect();
            await consumer.disconnect();
            await producer.connect();
            await producer.disconnect();
            _kafka = 'Success check health kafka';
        }
        catch (e) {
            this.logger.error(e);
            throw new common_1.HttpException('Failed check health kafka', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return {
            mysql,
            redis,
            kafka: _kafka,
        };
    }
};
HealthService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectConnection('report')),
    tslib_1.__param(1, typeorm_1.InjectConnection('master')),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Connection,
        typeorm_2.Connection,
        common_1.Logger])
], HealthService);
exports.HealthService = HealthService;
//# sourceMappingURL=health.service.js.map