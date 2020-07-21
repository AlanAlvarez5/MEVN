const express = require('express');
const app = express();

const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const history = require('connect-history-api-fallback');

// Middelware
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true}))

// Routes
// app.get('/', function(req, res){
//      res.send('Hola Mundo')
// })

// Vues Middelware
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000)

app.listen(app.get('port'), function(){
     console.log('Escuchando en puerto ', app.get('port'))
})