import express from "express";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
import settingsBill from "./settings-bill.js";
import moment from "moment-timezone";

// instance of express module
const app = express();
// settings bill factory function instance
const billWithSettings = settingsBill();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


const handlebarSetup = exphbs.engine({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
});

// to be able to configure express-handlebars use handlebars engine
// app.engine('handlebars', engine());
app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');
app.set('views', './views');

// app.set('views', __dirname + './views/');

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
                            warningLevel: billWithSettings.hasReachedWarningLevel(),
                            classNames: billWithSettings.classNames()
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

const timeStamp = () => {
    let actionsList = billWithSettings.actions();
    
    for (let i = 0; i < actionsList.length; i++) {
        actionsList[i].timestamp = moment().fromNow();
    }

    return actionsList;
};


app.get("/actions", (req, res) => {
    res.render("actions", {actions: timeStamp()});
});

app.get("/actions/:actionType", (req, res) => {
    const actionType = req.params.actionType;
    res.render("actions", {actions: billWithSettings.actionsFor(actionType)});
});

const PORT = process.env.PORT || 3007;

app.listen(PORT, () => {
    console.log("app started at:", PORT);
});