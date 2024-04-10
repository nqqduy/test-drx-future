import { InsertResult, ObjectLiteral, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
export declare class AppRepository<Entity extends ObjectLiteral> extends Repository<Entity> {
    insertIgnore(entity: QueryDeepPartialEntity<Entity> | QueryDeepPartialEntity<Entity>[]): Promise<InsertResult>;
    insertOnDuplicate(entity: QueryDeepPartialEntity<Entity> | QueryDeepPartialEntity<Entity>[], overwrite: string[], conflictTarget?: string | string[]): Promise<InsertResult>;
    replaceMulti(entity: QueryDeepPartialEntity<Entity> | QueryDeepPartialEntity<Entity>[]): Promise<any>;
}
