//en esta linea permute a la variable express usar la referencia a la libreria express
const express = require('express'); 
//en esta linea se usa una instancia de dicha libreria
const app = express();

//express le dice al SO que escuche el puerto especificado y que si hay un evento http, lo informa
// app.listen(3000, () => {
//   console.log('listening over port 3000');
// });

//el process.env.PORT lo da la aplicacion, es decir, setea el puerto
app.set('port', process.env.PORT || 3000); 

app.use(require('./routes/users'));

app.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`);
});

const morgan = require('morgan');

app.use(morgan('dev'));
