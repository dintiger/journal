const express = require("express");
const mongoose = require("mongoose");
const server = express();
require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("./config/passport.config");
const expressLayouts = require("express-ejs-layouts");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");

const authController = require("./controllers/auth.controllers");
const entryListController = require("./controllers/entryList.controllers");

require("dotenv").config();
const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("mongodb connected!");
});

server.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 360000 },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, //Store session in mongodb to preview re-login on server reload
    }),
  })
);

//-- middleware
server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));
server.set("view engine", "ejs");
server.use(expressLayouts);
server.use(methodOverride("_method"));

//-- passport initialization
server.use(passport.initialize());
server.use(passport.session());
server.use(flash());
// server.use(express.static("public"));

server.use(function (request, response, next) {
  // before every route, attach the flash messages and current user to res.locals
  response.locals.alerts = request.flash(); //{ success: [], error: []}
  response.locals.currentUser = request.user; //Makes logged in user accessibile in ejs as currentUser.
  next();
});

server.use("/user", authController);
server.use("/", entryListController);


server.get("*", (req, res) => {
  res.render("errors/404");
});

server.listen(PORT, () => {
  console.log(`connected to express on ${PORT}`);
});
