import { Repository } from 'typeorm';
export declare class BaseRepository<T extends {
    id: number;
}> extends Repository<T> {
    insertOrUpdate(entities: T[]): Promise<void>;
    findBatch(fromId: number, count: number): Promise<T[]>;
    getLastId(): Promise<number>;
    protected getColumns(target: string): string[];
    protected getTableName(target: string): string;
}
