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
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

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

// Flash
app.use(cookieParser('WOACUNQ'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

//Routes
routeAdmin(app);
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
