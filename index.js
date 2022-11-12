const express = require("express");
const { create } = require("express-handlebars");
const userRoute = require("./routes/user");
const app = express();
const path = require("path");
const hbs = create({
  extname: "hbs",
  defaultLayout: false,
  layoutsDir: "views/layouts/",
  partialsDir: "views/user/partials/",
  helpers: {
    tsnumber: (s) => {
      if (s === null || s === "") return false;
      else s = s.toString();
      s = s.replace(/(<([^>]+)>)/gi, "");
      return s.substring(0, 100) + ".....";
    },
    propername: (fn, ln) => {
      return fn + " " + ln;
    },
    loggedin: (n) => {
      return n ? true : false;
    },
  },
});
const port = process.env.PORT || 8000;
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: "mongodb://localhost:27017/my-blog729",
  collection: "mySessions",
});

app.use(express.static(__dirname + "/public"));

// Register `hbs.engine` with the Express app.
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views/"));

app.use(
  session({
    secret: "blog-1016",
    resave: false,
    saveUninitialized: false,
    store: store,
    resave: true,
  })
);

// to able to send flash messages like 'User registered successfully'
app.use(flash());

// to get input of forms
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/", userRoute);

app.listen(port, function () {
  console.log(`App listening on port ${port}`);
});
