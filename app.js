require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');
const bodyParser = require('body-parser');


const PORT = 3001;
const morgan = require('morgan');

const path = require('path');


app.use(morgan('dev'));
app.use("/image", express.static('public/images'));


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req,res) => {
    const date = new Date();
    const month = date.getFullYear();
    console.log(month);
})

app.use('/api', routes);

app.listen(PORT, () => {
    console.log('listen on port', PORT);
});