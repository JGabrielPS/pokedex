//en esta linea permute a la variable express usar la referencia a la libreria express
const express = require("express");
//en esta linea se usa una instancia de dicha libreria
const app = express();
//se declaran las variables que tendran los objetos para manejar las rutas
const index = require("./routes/index");
const user = require("./routes/users");

//el process.env.PORT lo da la aplicacion, es decir, setea el puerto
app.set("port", process.env.PORT || 3000);

app.use(express.static("ui"));

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    `http://localhost:${app.get("port")}`
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-COntrol-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

const morgan = require("morgan");

app.use(morgan("dev"));

app.use("/", index);
app.use("/user", user);

//express le dice al SO que escuche el puerto especificado y que si hay un evento http, lo informa
app.listen(app.get("port"), (error) => {
  if (error) {
    console.log(`There was an error in port ${app.get("port")}: ${error}`);
    return;
  } else {
    console.log(`Listening on ${app.get("port")}`);
  }
});
