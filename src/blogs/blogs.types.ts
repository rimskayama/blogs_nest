export type BlogDto = {
	id: string;
	name: string;
	description: string;
	websiteUrl: string;
	isMembership: boolean | false;
	createdAt: string;
};

export type BlogType = {
	id: string;
	name: string;
	description: string;
	websiteUrl: string;
	createdAt: Date;
	isMembership: boolean;
};
