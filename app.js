require("dotenv").config(); // si se modifica el .env es necesario reiniciar el servidor para que tome los cambios
const express = require("express");
const { validateUser, isUniqueId } = require("./utils/validation");

const fs = require("fs");
const path = require("path");

const usersFilePath = path.join(__dirname, "users.json");
console.log("usersFilePath");

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

app.get("/users", (req, res) => {
  //Conectar a la base de datos
  fs.readFile(usersFilePath, "utf-8", (error, data) => {
    if (error) {
      return res.status(500).json({ Error: "Error en la conexión de datos" });
    }
    const users = JSON.parse(data);
    res.json(users);
  });
});

app.post("/users", (req, res) => {
  const newUser = req.body;
  //const { name, email } = req.body;

  fs.readFile(usersFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error con conexión de Datos." });
    }
    const users = JSON.parse(data);
    const validationId = isUniqueId(newUser.id, users);
    const validation = validateUser(newUser, users);

    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    } else if (validationId) {
      return res.status(400).json({
        error: "El ID que intenta registrar ya existe.",
      });
    } else {
      users.push(newUser);
      fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error al guardar el usuario." });
        }
        res.status(201).json(newUser);
      });
    }
  });
});

app.put("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const updateUser = req.body;

  fs.readFile(usersFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error con la conexión de datos." });
    }

    let users = data.trim() === "" ? [] : JSON.parse(data);

    const validation = validateUser(updateUser, users);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors });
    }

    users = users.map((user) =>
      user.id === userId ? { ...user, ...updateUser } : user,
    );
    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al actializar el usuario" });
      }
      res.json(updateUser);
    });
  });
});

app.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id, 10);
  fs.readFile(usersFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(400).json({ error: "Error con conexión de datos." });
    }
    let users = JSON.parse(data);
    users = users.filter((user) => user.id !== userId);
    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Error al eliminar el usuario" });
      }
      res.status(204).send();
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost/${PORT}`);
});
