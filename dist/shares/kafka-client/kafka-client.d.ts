import { RecordMetadata } from 'kafkajs';
export declare class KafkaClient {
    private producer;
    constructor();
    send<T>(topic: string, data: T): Promise<RecordMetadata[]>;
    sendPrice<T>(topic: string, data: T): Promise<RecordMetadata[]>;
    consume<T>(topic: string, groupId: string, callback: (data: T) => Promise<void>, options?: {}): Promise<void>;
    getMessageAtOffset(offset: string, topic: string): Promise<void>;
    delete(topics: string[]): Promise<void>;
    getCombinedLag(topic: string, groupId: string): Promise<number>;
    private convertOffsetsToMap;
}
