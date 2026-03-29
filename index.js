require('dotenv').config();
const express = require('express');
const routeAdmin = require('./routes/admin/index.route');
const route = require('./routes/client/index.route');
const app = express();
const port = process.env.PORT;
const systemConfig = require('./config/system.js');
const methodOverride = require('method-override');
const database = require('./config/database.js');
const bodyParser = require('body-parser');




database.connect();

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));

//App Locals Varriables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// method
app.use(methodOverride('_method'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//Routes
routeAdmin(app);
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
