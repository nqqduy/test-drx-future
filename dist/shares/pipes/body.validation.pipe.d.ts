import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
export declare class BodyValidationPipe extends ValidationPipe {
    constructor();
    getMessageFromErrs(errs: ValidationError[], parent?: string): string;
    getPropertyAndContraints(errs: ValidationError[]): unknown[];
}
