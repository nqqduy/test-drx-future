"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomDeviateNumber = exports.checkRecoverSameAddress = exports.emptyWeb3 = exports.sleep = void 0;
const Web3 = require('web3');
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
exports.sleep = sleep;
exports.emptyWeb3 = new Web3();
const checkRecoverSameAddress = async ({ address, signature, message, }) => {
    const recover = await exports.emptyWeb3.eth.accounts.recover(message, signature);
    const recoverConvert = Web3.utils.toChecksumAddress(recover);
    const addressConvert = Web3.utils.toChecksumAddress(address);
    return addressConvert === recoverConvert;
};
exports.checkRecoverSameAddress = checkRecoverSameAddress;
const getRandomDeviateNumber = (sourceNumber, fromDeviation, toDeviation) => {
    const array = [1, -1];
    const randomIndex = Math.floor(Math.random() * array.length);
    const positiveOrNagative = array[randomIndex];
    const deviateNumber = fromDeviation + Math.random() * (toDeviation - fromDeviation);
    const randomDeviateNumber = sourceNumber + (sourceNumber * positiveOrNagative * deviateNumber) / 100;
    return randomDeviateNumber;
};
exports.getRandomDeviateNumber = getRandomDeviateNumber;
//# sourceMappingURL=utils.js.map