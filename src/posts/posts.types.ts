import { likeDetails } from "./posts.entity";

export type PostInputDto = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export type PostDto = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string,
        newestLikes: likeDetails[]
    }
}

export type postsPaginationDto = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: PostDto[]

}
