Assignment 1 - REST API Project - Response to Criteria
================================================

Overview
------------------------------------------------

- **Name:** Riley Anderssen
- **Student number:** n11280859
- **Application name:** Video Transcoder
- **Two line description:** The app uses ffmpeg to transcode video files
uploaded by the user. User can specify multiple formats.


Core criteria
------------------------------------------------

### Containerise the app

- **ECR Repository name:** n11280859-file-transcoder
- **Video timestamp:** 00:00
- **Relevant files:**
    - DockerFile
    - All files

### Deploy the container

- **EC2 instance ID:** i-03ad50274d7ca9aec
- **Video timestamp:** 00:00

### User login

- **One line description:** Hard coded email/password array, using JWT tokens for session management.
- **Video timestamp:** 00:13 
- **Relevant files:**
    - /controllers/users.js
    - /helpers/security.js
    - /middleware/middleware.js
    - /models/users.js
    - /routes/users.js
    - /constants/error.js

### REST API

- **One line description:** Rest API with endpoints and HTTP methods, responds with status codes.
- **Video timestamp:** 1:00
- **Relevant files:**
    - /routes/files.js
    - /routes/folders.js
    - /routes/transcodes.js
    - /routes/users.js

### Data types

- **One line description:** Video files, transcode files, file data
- **Video timestamp:** 02:55
- **Relevant files:**
    - /db.js
    - /uploads
    - /models

#### First kind

- **One line description:** Video and Transcoded Video Files.
- **Type:** Unstructured
- **Rationale:** Video files are too large for database storage.
- **Video timestamp:** 03:07
- **Relevant files:**
    - /models/file.js
    - /models/transcode.js
    - /uploads

#### Second kind

- **One line description:** File data
- **Type:** Structured
- **Rationale:** Method of getting video data for user
- **Video timestamp:** 02:55
- **Relevant files:**
  - /models/file.js
  - /models/folder.js
  - /models/transcode.js

### CPU intensive task

 **One line description:** Video Transcoding
- **Video timestamp:** 03:24
- **Relevant files:**
    - /controllers/transcodes.js

### CPU load testing

 **One line description:** Node script to trigger transcoding 
- **Video timestamp:** 03:24
- **Relevant files:**
    - /controllers/transcodes.js

Additional criteria
------------------------------------------------

### Extensive REST API features

- **One line description:** Filtering and pagination of files and transcodes
- **Video timestamp:** 02:15
- **Relevant files:**
    - /controllers/files.js
    - /controllers/transcodes.js
    - /helpers/data.js
    - /models/file.js
    - /models/transcode.js

### External API(s)

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**
    - 

### Additional types of data

- **One line description:** Multiple video formats supported and folder hierarchy system implemented
- **Video timestamp:** 04:34
- **Relevant files:**
    - /controllers/folders.js
    - /models/folder.js
    - /controllers/transcodes.js
    - /models/transcode.js

### Custom processing

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**
    - 

### Infrastructure as code

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**
    - 

### Upon request

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**
    - 