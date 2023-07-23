import express from "express";
import { engine } from "express-handlebars";

// instance of express module
const app = express();

// to be able to configure express-handlebars use handlebars engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// use static middleware to make the public folder public to the server
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index");
});

const PORT = process.env.PORT || 3007;

app.listen(PORT, () => {
    console.log("app started at:", PORT);
});