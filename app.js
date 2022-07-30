require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');
const bodyParser = require('body-parser');
const multer  = require('multer')
const PORT = 3001;
const morgan = require('morgan');
const upload = multer();

app.use(morgan('dev'));
// app.use(express.json());
// app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req,res) => {
    res.send('ok');
})
app.use('/api',upload.none(), routes);

app.listen(PORT, () => {
    console.log('listen on port', PORT);
});