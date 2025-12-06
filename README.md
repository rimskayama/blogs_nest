### This project is a RESTful API designed for a blogging platform. Can be used for user authentication, blog management, post creation, commenting, and administrative functionalities. 

### ▎Technologies used:

- Nest
- Typescript
- PostgreSQL
- Passport
- Class-validator

### ▎Installation
```
$ yarn install
```
### ▎Running the app
```
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod

# test
$ yarn test:e2e
```
Set environment variables using .env.example

### ▎API Documentation
### ▎The authentication module allows users to manage their accounts:
```
• POST /auth/registration - Registers a new user by email (status code - 204)
• POST /auth/registration-confirmation - Confirms user registration via email by sending code (status code - 204)
• POST /auth/login - Authenticates users by login and password, returns a access-token (status code - 200)
• POST /auth/refresh-token - Allows users to get refresh-token by access-token (status code - 200)
• GET /auth/me - Retrieves the current user's profile information (status code - 200)
• POST /auth/password-recovery - Initiates the password recovery process, sends an email with a link to reset user's password (status code - 204)
• POST /auth/new-password - Allows users to set a new password (status code - 204)
• POST /auth/registration-email-resending - Resends the registration confirmation email (status code - 204)
• POST /auth/logout - Logs out the user (status code - 204)
```
others HTTP status codes:
```
400 - bad request: validation failed (email/login already exists, email already confirmed, incorrect recovery code; accessToken/refreshToken)
404 - user, token information, recovery code, password information (hash, salt) were not found in DB 
```

### ▎Blogs

### The blogging module allows users to view and manage blogs.
```
• GET /blogs - Retrieves a list of all blogs (status code - 200).
• GET /blogs/{blogId}/posts - Retrieves posts associated with a specific blog by blogId (status code - 200)
• GET /blogs/{id} - Retrieves detailed information about a specific blog by blogId (status code - 200)
```
others HTTP status codes:
```
400 - bad request: validation failed (id does not match) 
404 - blog was not found in DB 
```

### ▎Posts
### Users can create and manage posts within blogs. 
```
• GET /posts - Retrieves a list of all posts (status code - 200)
• GET /posts/{id} - Retrieves detailed information about a specific post by postId (status code - 200)
• GET /posts/{postId}/comments - Retrieves comments associated with a specific post by postId (status code - 200)
• POST /posts/{postId}/comments - Adds a comment to a specific post by postId (status code - 201)
• PUT /posts/{postId}/like-status - Updates the like status of a specific post by postId, changes like-status, variants: "None", "Like", "Dislike" (status code - 204)
```
others HTTP status codes:
```
400 - bad request: validation failed (id, type, length, format does not match) 
403 - forbidden, attempt to update/delete post that doesn't belongs to user, userId doesn't match the post owner's userId
404 - comment was not found in DB
```
### ▎Comments
### The comments module allows users to manage comments on posts.
```
• GET /comments/{id} - Retrieves detailed information about a specific comment by commentId (status code - 200)
• PUT /comments/{commentId} - Updates the content of a specific comment by commentId (status code - 204)
• PUT /comments/{commentId}/like-status - Updates the like status of a specific comment, changes like-status, variants: "None", "Like", "Dislike" (status code - 204)
• DELETE /comments/{commentId} - deletes comment by commentId (status code - 204)
```
others HTTP status codes:
```
400 - bad request: validation failed (id, type, length, format does not match) 
403 - forbidden: attempt to update/delete comment that doesn't belongs to user, userId doesn't match the comment owner's userId
404 - comment was not found in DB 
```
### ▎Security Devices - Logging in from different devices  
### This module manages user devices. 
```
• Get User Devices: GET /security/devices - Retrieves a list of devices associated with the user (status code - 200)
• Delete All Devices: DELETE /security/devices - Deletes all devices associated with the user (status code - 204)
• Delete Specific Device: DELETE /security/devices/{deviceId} - Deletes a specific device from the user's account by deviceId (status code - 204)
```
others HTTP status codes:
```
400 - bad request, validation failed (accessToken/refreshToken)
403 - forbidden, attempt to terminate session that doesn't belongs to user, userId doesn't match the session owner's userId
404 - session was not found in DB
```
### ▎Super Admin Features
### Super admins have additional capabilities for managing users and blogs. 
### ▎Blogs Management
```
• GET /sa/blogs - Retrieves all blogs for administrative purposes (status code - 200)
• POST /sa/blogs - Creates a new blog (status code - 201)
• PUT /sa/blogs/{id} - Updates details of an existing blog by blogId (status code - 204)
• DELETE /sa/blogs/{id} - Deletes an existing blog by blogId (status code - 204)
```
others HTTP status codes:
```
400 - bad request: validation failed (id, type, length, format does not match) 
403 - forbidden, attempt to update/delete blog that doesn't belongs to user, userId doesn't match the blog owner's userId
404 - blog was not found in DB 
```
### ▎Blog Posts Management:
```
• POST /sa/blogs/{blogId}/posts - Creates a new post in a specified blog by blodId (status code - 201)
• GET /sa/blogs/{blogId}/posts - Retrieves posts for a specified blog by blogId (status code - 200)
• PUT /sa/blogs/{blogId}/posts/{postId} - Updates a specific post in a blog (status code - 204)
• DELETE /sa/blogs/{blogId}/posts/{postId} - Deletes a specific post from a blog (status code - 204)
```
others HTTP status codes:
```
400 - bad request: validation failed (id, type, length, format does not match) 
403 - forbidden, attempt to update/delete post that doesn't belongs to user, userId doesn't match the blog owner's userId
404 - blog/post was not found in DB 
```
### ▎Users Management
```
• GET /sa/users - Retrieves all users for administrative purposes (status code - 200)
• GET /sa/users/{userId} - Retrieves detailed information about a specific user by userId (status code - 200)
• POST /sa/users - Creates a new user account (status code - 201)
• DELETE /sa/users/{id} - Deletes an existing user account (status code - 204)
```
others HTTP status codes:
```
400 - bad request: validation failed (id, type, length, format does not match) 
404 - user was not found in DB
```
