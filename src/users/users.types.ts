import { Sort } from "mongodb"

export type UserDto = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}

export type UserInputDto = {
    login: string,
    password: string,
    email: string
}

export type UsersPaginationDto = {
    pagesCount: number
    page: number;
    pageSize: number;
    totalCount: number;
    items: UserDto[]
}

export class QueryParameters {
    pageNumber: number;
    pageSize: number;
    sortDirection: Sort;
    sortBy: string;
    sortByUsers: string;
    searchNameTerm: string;
    searchLoginTerm: string;
    searchEmailTerm: string;
    skip: number;
}
