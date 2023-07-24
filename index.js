import express from "express";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
import settingsBill from "./settings-bill.js";

// instance of express module
const app = express();
// settings bill factory function instance
const billWithSettings = settingsBill();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// to be able to configure express-handlebars use handlebars engine
// app.engine('handlebars', engine());
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// use static middleware to make the public folder public to the server
app.use(express.static("public"));


// ROUTES:

app.get("/", (req, res) => {

    // here we are rendering the billWithSettings.getSettings object, by setting the key settings with those
    // values, so that we can just look up the methods returned by billWithSettings.getSettings
    res.render("index", {
                            settings: billWithSettings.getSettings(),
                            totals: billWithSettings.totals(),
                            criticalLevel: billWithSettings.hasReachedCriticalLevel(),
                            warningLevel: billWithSettings.hasReachedWarningLevel()
                        });
});


app.post("/settings", (req, res) => {


    // setting the values into the factory function
    billWithSettings.setSettings({
        // getting name of callCost, smsCost, warningLevel and criticalLevel

        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    })

    res.redirect("/");
});


app.post("/action", (req, res) => {

    billWithSettings.recordAction(req.body.actionType);

    res.redirect("/");
});

app.get("/actions", (req, res) => {
    res.render("actions", {actions: billWithSettings.actions()});
});

app.get("/actions/:actionType", (req, res) => {
    const actionType = req.params.actionType;
    res.render("actions", {actions: billWithSettings.actionsFor(actionType)});
});

const PORT = process.env.PORT || 3007;

app.listen(PORT, () => {
    console.log("app started at:", PORT);
});