import { PaginationDto } from 'src/shares/dtos/pagination.dto';
export declare const getQueryLimit: (paginationDto: PaginationDto, maxResultCount?: number) => {
    offset: number;
    limit: number;
};
