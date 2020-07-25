//en esta linea permute a la variable express usar la referencia a la libreria express
const express = require("express");
//en esta linea se usa una instancia de dicha libreria
const app = express();

//se declaran las variables que tendran los objetos para manejar las rutas
const index = require("./routes/index");
const user = require("./routes/user");
const collection = require("./routes/collection");
const team = require("./routes/team");
const auth = require("./routes/auth");

//middleware para manejar sesiones a traves de cookies
const expressSession = require("express-session");
app.use(
  expressSession({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: false,
  })
);

//el process.env.PORT lo da la aplicacion, es decir, setea el puerto
app.set("port", process.env.PORT || 3000);

//se establece la carpeta donde se buscaran los recursos estaticos
app.use(express.static("ui"));

//se usa un motor de renderizado para los html dinamicos en la carpeta views
const ejs = require("ejs");
app.set("view engine", "ejs");

//se establecen los headers para evitar cors
// app.use((req, res, next) => {
//   res.header(
//     "Access-Control-Allow-Origin",
//     `http://localhost:${app.get("port")}`
//   );
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-COntrol-Allow-Request-Method"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//   res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
//   next();
// });

//middleware para visualizar peticiones
const morgan = require("morgan");
app.use(morgan("dev"));

//objeto global de node donde creamos la key userName y userId para
//conocer nombre de usuario y id ademas de conocer si la sesion esta activa
global.userName = null;
global.userId = null;

//rutas usadas en el proyecto
app.use("*", (req, res, next) => {
  userName = req.session.userName;
  userId = req.session.userId;
  next();
});
app.use("/", index);
app.use("/user", user);
app.use("/collection", collection);
app.use("/team", team);
app.use("/auth", auth);
//ruta para el caso de acceder a un recurso inexistente
app.use((req, res) =>
  res.status(404).render("notFound", { pageTitle: "404-Not Found" })
);

//express le dice al SO que escuche el puerto especificado y que si hay un evento http, lo informa
app.listen(app.get("port"), (error) => {
  if (error) {
    console.log(`There was an error in port ${app.get("port")}: ${error}`);
    return;
  } else {
    console.log(`Listening on ${app.get("port")}`);
  }
});
