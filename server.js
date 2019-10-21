const express = require("express")
const logger = require("morgan")
const mongoose = require("mongoose")
var Handlebars = require('handlebars');
const exphbs = require("express-handlebars");

const PORT = 3000;
const MONGODB_URL = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"
const app = express();

require("./routes/apiRoutes")(app)
// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect(MONGODB_URL,{ useNewUrlParser: true, useUnifiedTopology: true })

// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


Handlebars.registerHelper("inc", function(value, options){
    return parseInt(value) + 1
})


app.listen(PORT, () => console.log("App running on port " + PORT + "!"))
