// Requiring necessary npm packages
const express = require("express");
const session = require("express-session");
var bodyparser = require('body-parser'); 
// Requiring passport as we've configured it
const passport = require("./config/passport");
// Defines global variable for basedir
global.__basedir = __dirname;

// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 8181;
const db = require("./models");

// Creating express app and configuring middleware needed for authentication
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.urlencoded({extended : true}))
app.use(express.json());
app.use(express.static("public"));

// Set Handlebars.
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// We need to use sessions to keep track of our user's login status
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/user-api-routes.js")(app);
require("./routes/image-api-routes.js")(app)
require("./routes/comment-api-routes.js")(app)
require("./routes/like-api-routes.js")(app)

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});
