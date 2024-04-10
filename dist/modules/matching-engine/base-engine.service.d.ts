import { Producer } from 'kafkajs';
export declare class BaseEngineService {
    loadData(producer: Producer, getter: (fromId: number, batchSize: number) => Promise<{
        [key: string]: any;
    }[]>, code: string, topic: string): Promise<void>;
    protected sendData(producer: Producer, topic: string, code: string, entities: {
        [key: string]: any;
    }[]): Promise<void>;
}
