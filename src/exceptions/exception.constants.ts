// Fields
export const blogIdField = 'blogId';
export const postIdField = 'postId';
export const userIdField = 'userId';
export const commentIdField = 'commentId';
export const deviceIdField = 'deviceId';
export const questionIdField = 'questionId';

// Not found
export const blogNotFound = 'Blog not found';
export const postNotFound = 'Post not found';
export const userNotFound = 'User not found';
export const commentNotFound = 'Comment not found';
export const deviceNotFound = 'Device not found';
export const questionNotFound = 'Question not found';

// Forbidden

export const forbidden = 'Forbidden';

export enum StatusCode {
	Success,
	BadRequest,
	NotFound,
	Forbidden,
}
