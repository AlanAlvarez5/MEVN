const express = require('express');
const app = express();

const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const history = require('connect-history-api-fallback');
const mongoose = require('mongoose');

// Middelware
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true}))

const uri = 'mongodb://localhost:27017/mevn-app';
const options = {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true};

mongoose.connect(uri, options).then(
     () => { console.log('Conectado a DB') },
     err => { console.log(err) }
);


// Routes
// app.get('/', function(req, res){
//      res.send('Hola Mundo')
// })

app.use('/api', require('./routes/nota'))

// Vues Middelware
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000)

app.listen(app.get('port'), function(){
     console.log('Escuchando en puerto ', app.get('port'))
})