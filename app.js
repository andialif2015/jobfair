require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');
const bodyParser = require('body-parser');
const multer  = require('multer')
const { PORT } = process.env;
const morgan = require('morgan');
const upload = multer();

app.use(morgan('dev'));
// app.use(express.json());
// app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api',upload.none(), routes);

app.listen(PORT, () => {
    console.log('listen on port', PORT);
});