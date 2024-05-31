export type CommentViewDto = {
	id: string;
	content: string;
	commentatorInfo: {
		userId: string;
		userLogin: string;
	};
	createdAt: string;
	likesInfo: {
		likesCount: number;
		dislikesCount: number;
		myStatus: string;
	};
};

export type CommentDto = {
	id: string;
	postId: string;
	content: string;
	userId: string;
	userLogin: string;
	createdAt: Date;
	likesCount?: number;
	dislikesCount?: number;
	myStatus?: string;
};

export type CommentType = {
	id: string;
	postId: string;
	content: string;
	createdAt: Date;
	userId: string;
};

export type commentanorInfo = {
	userId: string;
	userLogin: string;
};

export type likesInfo = {
	likesCount: number;
	dislikesCount: number;
	myStatus: string;
};
