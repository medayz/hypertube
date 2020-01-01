const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./api/routes/index');
const usersRouter = require('./api/routes/user');
const videosRouter = require('./api/routes/video');

const app = express();

// Config socket.io
const server = require('http').createServer(app);
const io = require('socket.io')(server);

require('./api/socket')(io);

server.listen(4000);

app.set('io', io);

// Enable CORS
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/video', videosRouter);

module.exports = app;
