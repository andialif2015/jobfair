require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');
const { PORT } = process.env;
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1', routes);


app.listen(PORT, () => {
    console.log('listen on port', PORT);
});