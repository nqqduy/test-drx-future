import { Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
export declare class LoggerMiddleware implements NestMiddleware {
    private readonly logger;
    constructor(logger: Logger);
    use(req: Request, res: Response, next: (err?: Error) => void): void;
}
