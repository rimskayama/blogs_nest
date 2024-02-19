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
