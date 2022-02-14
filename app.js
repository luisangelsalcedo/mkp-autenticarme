const express = require("express");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

// Schema
const userSchema = {
  name: String,
  email: String,
  password: String,
};

// Model
const User = mongoose.model("User", userSchema);

const app = express();
app.set("login", false);
// middleware
app.use(express.urlencoded());

// templates
app.set("view engine", "ejs");

// GET /login - muestra el formulario de autenticación.
app.get("/login", (req, res) => {
  res.render("login.ejs", { err: "" });
});

// POST /login- autentica al usuario.
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userFind = await User.findOne({ email: email, password: password });
  if (!!userFind) {
    app.set("login", true);
    res.redirect("/");
  } else {
    res.render("login.ejs", { err: "Wrong email or password. Try again!" });
  }
});

// GET /logout - se utiliza para desautenticarse (si esa palabra existe).
app.get("/logout", (req, res) => {
  if (app.get("login")) app.set("login", false);
  res.redirect("/");
});

/**
 *
 * ////////////////////  EJERCICIO ANTERIOR  ////////////////////
 *
 */
// GET /
app.get("/", async (req, res) => {
  if (app.get("login")) {
    // verificamos si esta logeado sino redireccionamos al login

    const userList = await User.find();
    if (!!userList) {
      res.status(200).render("index.ejs", { usuarios: userList });
    } else {
      res.status(204).send();
    }
  } else res.redirect("login");
});
// muestra el formulario para registrarse
app.get("/register", (req, res) => {
  res.render("formulario.ejs");
});

// crea al usuario en MongoDB.
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = new User({
    name: name,
    email: email,
    password: password,
  });

  const update = await newUser.save();

  !!update
    ? res.status(200).redirect("/")
    : res.status(500).render("formulario.ejs");
});

// SERVER
app.listen("3000", () => {
  console.log("server run");
});
