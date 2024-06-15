Blogs and posts project API (NestJS, PostgreSQL)

### Technologies used:

- Nest
- Typescript
- PostgreSQL
- Passport
- Class-validator

### Usage

The paths:

```
AUTH

POST /auth/login
POST /auth/password-recovery
POST /auth/new-password
POST /auth/refresh-token
POST /auth/registration-confirmation
POST /auth/registration
POST /auth/registration-email-resending
POST /auth/logout
POST /auth/me
```

```
BLOGS

GET /blogs
GET /blogs/{blogId}/posts
GET /blogs/{id}
```

```
POSTS

GET /posts
GET /posts/{id}
GET /posts/{postId}/comments
POST /posts/{postId}/comments
PUT /posts/{postId}/like-status
```

```
COMMENTS

GET /comments/{id}
PUT /comments/{commentId}
PUT /comments/{commentId}/like-status
```

```
SECURITY DEVICES

GET /security/devices
DELETE /security/devices
DELETE /security/devices/{deviceId}
```

```
SUPER ADMIN BLOGS

GET /sa/blogs
POST /sa/blogs
PUT /sa/blogs/{id}
DELETE /sa/blogs/{id}
POST /sa/blogs/{blogId}/posts
GET /sa/blogs/{blogId}/posts
PUT /sa/blogs/{blogId}/posts/{postId}
DELETE /sa/blogs/{blogId}/posts/{postId}
```

```
SUPER ADMIN USERS
GET /sa/users
POST /sa/users
DELETE /sa/users/{id}
```
