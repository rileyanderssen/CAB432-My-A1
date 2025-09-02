const express = require('express');
const app = express();
const cors = require('cors');
const path = require("path");

const usersRouter = require('./src/routes/users');
const fileRouter = require('./src/routes/files');
const transcodeRouter = require('./src/routes/transcodes');
const folderRouter = require('./src/routes/folders');
const loadTestRouter = require('./src/routes/loadTest');

// NOTE -> current extra requirements done
// Additional Types of Data: different transcode formats
// Extended API Features -> pagination and filtering (transcode/file get all route)

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/users', usersRouter);
app.use('/files', fileRouter);
app.use('/transcode', transcodeRouter);
app.use('/folder', folderRouter);
app.use('/videos', express.static(path.join(__dirname, 'uploads')));
app.use('/loadtest', loadTestRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// access host using 8080, host then forwards it to port 3000