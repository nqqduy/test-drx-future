import { Consumer } from 'kafkajs';
export declare function subscribeKafka(group: string, topic: string, fromBeginning?: boolean): Promise<Consumer>;
