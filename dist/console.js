"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const nestjs_console_1 = require("nestjs-console");
const app_module_1 = require("./app.module");
const bootstrap = new nestjs_console_1.BootstrapConsole({
    module: app_module_1.AppModules,
    useDecorators: true,
    contextOptions: {
        logger: true,
    },
});
bootstrap.init().then(async (app) => {
    try {
        await app.init();
        await bootstrap.boot();
        await app.close();
        process.exit(0);
    }
    catch (e) {
        console.error(e);
        await app.close();
        process.exit(1);
    }
});
//# sourceMappingURL=console.js.map