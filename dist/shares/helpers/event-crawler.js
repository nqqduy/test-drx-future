"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crawlEvents = void 0;
const config = require("config");
const common_1 = require("@nestjs/common");
const configs_1 = require("../../configs");
const utils_1 = require("./utils");
const BLOCK_CONFIRM = configs_1.getConfig().get('dex.block_confirm');
const BLOCK_STEP = 5000;
const START_BLOCK = Number(config.get('dex.start_block'));
const BLOCK_TIME = Number(config.get('dex.block_time_in_ms'));
async function crawlEvents(startBlock, provider, contract, queryTopics, callback) {
    const logger = new common_1.Logger();
    let cursor = startBlock || START_BLOCK;
    while (true) {
        const to = Math.min(cursor + BLOCK_STEP, (await provider.getBlockNumber()) - BLOCK_CONFIRM);
        if (cursor + 1 > to) {
            await utils_1.sleep(BLOCK_TIME);
            continue;
        }
        const events = await contract.queryFilter({
            address: contract.address,
            topics: queryTopics,
        }, cursor + 1, to);
        logger.log(`Crawled from ${cursor + 1} to ${to}, got ${events.length} events.`);
        cursor = to;
        await callback(events, to);
        if (events.length === 0) {
            await utils_1.sleep(BLOCK_TIME);
        }
    }
}
exports.crawlEvents = crawlEvents;
//# sourceMappingURL=event-crawler.js.map