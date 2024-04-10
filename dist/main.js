"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const Sentry = require("@sentry/node");
const config = require("config");
const helmet = require("helmet");
const redis_adapter_1 = require("./adapters/redis.adapter");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./shares/filters/http-exception.filter");
const response_interceptor_1 = require("./shares/interceptors/response.interceptor");
const sentry_interceptor_1 = require("./shares/interceptors/sentry.interceptor");
const body_validation_pipe_1 = require("./shares/pipes/body.validation.pipe");
const appPort = config.get('app.port');
const dnsSentry = config.get('sentry_dns');
const appEnv = config.get('app.node_env');
const prefix = config.get('app.prefix');
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModules, { cors: true });
    Sentry.init({
        dsn: dnsSentry,
        environment: appEnv,
    });
    app.setGlobalPrefix(prefix);
    app.use((req, res, next) => {
        if (req.originalUrl === '/metric') {
            req.url = `/${prefix}/metric`;
        }
        next();
    });
    app.enableCors();
    app.useGlobalInterceptors(new sentry_interceptor_1.SentryInterceptor());
    app.useGlobalInterceptors(new response_interceptor_1.ResponseTransformInterceptor());
    app.useGlobalPipes(new body_validation_pipe_1.BodyValidationPipe());
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useWebSocketAdapter(new redis_adapter_1.RedisIoAdapter(app));
    const appName = config.get('app.name');
    const options = new swagger_1.DocumentBuilder()
        .addBearerAuth()
        .setTitle(appName)
        .setDescription(appName)
        .setVersion(prefix)
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup(`${prefix}/docs`, app, document, {
        customSiteTitle: appName,
        swaggerOptions: {
            docExpansion: 'list',
            filter: true,
            displayRequestDuration: true,
        },
    });
    app.use(helmet());
    await app.listen(appPort);
    const logger = app.get(common_1.Logger);
    logger.setContext('NestApplication');
    logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map