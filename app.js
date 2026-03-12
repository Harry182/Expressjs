require("dotenv").config(); // si se modifica el .env es necesario reiniciar el servidor para que tome los cambios
const express = require("express");
const app = express();
//Apartir de la version 4.16 de express ya no es necesario instalar body-parser para parsear el cuerpo de las solicitudes, ya que express incluye esta funcionalidad de forma nativa.
// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
console.log(PORT);

app.get("/", (req, res) => {
  res.send(`<h1>Curso express.js v2</h1>
    <p>Esto es una aplicacion node.js con express.js</p>
    <p>corre en el puerto ${PORT}</p>
    
    `);
});

app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  res.send(`Mostrar informacion del usario con Id: ${userId}`);
});

app.get("/search", (req, res) => {
  const terms = req.query.termino || "No especificado";
  const category = req.query.categoria || "Todas";

  res.send(`
    <h2>Resultado de busqueda:</h2>
    <p>Termino: ${terms}</p>
    <p>Categoria: ${category}</p>
    `);
});

app.post("/form", (req, res) => {
  const { name, email } = req.body || {
    name: "No especificado",
    email: "No especificado",
  };
  res.json({
    message: "Formulario recibido",
    data: {
      name,
      email,
    },
  });
});

app.post("/api/data", (req, res) => {
  const data = req.body;

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ error: "No se proporciono ningun dato" });
  }
  res.status(201).json({
    message: "Datos recibidos correctamente",
    data,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost/${PORT}`);
});
