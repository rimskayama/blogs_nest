export type BlogInputDto = {
    name: string, 
    description: string,
    websiteUrl: string,
}

export type BlogDto = {
    id: string
    name: string,
    description: string,
    websiteUrl: string,
    isMembership: boolean | false,
    createdAt: string
}

export type BlogsPaginationDto =
    {
        pagesCount: number;
        page: number;
        pageSize: number;
        totalCount: number;
        items: BlogDto[]
    }

