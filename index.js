const express = require('express');
var cors = require('cors');
const connection = require('./connections');
const userRoute = require('./routes/user');
const projectRoute = require('./routes/project');
const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/user', userRoute);
app.use('/project', projectRoute);



module.exports = app;