import { IsString, IsUrl, Length } from "class-validator";

export class BlogInputDto {
    @IsString({
        message: "Incorrect type"})
    @Length(1, 15, {
        message: "Name length should be minimum 1 and maximum 500 symbols"
    })
    name: string;
    @IsString({
        message: "Incorrect type"})
    @Length(1, 500, {
        message: "Description length should be minimum 1 and maximum 15 symbols"})
    description: string;
    @IsString({
        message: "Incorrect type"})
    @Length(1, 100, {
        message: "WebsiteUrl length should be minimum 1 and maximum 100 symbols"
    })
    @IsUrl({}, {
        message: "Incorrect type"})
    websiteUrl: string;
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

