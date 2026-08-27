require("dotenv").config();

const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");

const app = express();
const port = process.env.PORT;

// Config
const database = require("./config/database");
const systemConfig = require("./config/system");

// Routes
const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

// Helpers
const formatDate = require("./helpers/formatDate");

// Connect Database
database.connect();

// View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// App Locals
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.formatDate = formatDate;

// Method Override
app.use(methodOverride("_method"));

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));

// Cookie & Session
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "WOACUNQ",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000,
    },
  })
);

// Flash
app.use(flash());

// TinyMCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

// Routes
routeAdmin(app);
route(app);
app.use((req, res) => {
  res.status(404).render("client/pages/errors/404", {
    pageTitle: "404 Not Found"
  });
});


// Start Server
app.listen(port, () => {
  console.log(__dirname);
  console.log(`Example app listening on port ${port}`);
});