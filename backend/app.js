const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");
const ticketsRoutes = require("./routes/tickets");


const app = express();


mongoose
  .connect(
    "mongodb+srv://Zack:"+process.env.MONGO_ATLAS_PW+"@anayaro.cj7wp.mongodb.net/DB_Test?retryWrites=true&w=majority"

  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log(err);
    console.log("Connection failed!");
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));
app.use("/ticketFiles", express.static(path.join("backend/ticketFiles")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/tickets", ticketsRoutes);
app.use("/api/user", userRoutes);
app.use(express.static(path.join(__dirname, "/angular")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/angular/index.html"));
});

module.exports = app;
