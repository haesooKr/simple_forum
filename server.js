require('./models/db');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const paginate = require('handlebars-paginate');
const bodyParser = require('body-parser');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const app = express();
const thread = require('./controllers/thread');

app.use(cookieParser());
app.use(session({
  secret: "10181018",
  resave: false,
  saveUninitialized: true
}))
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ 
  extname: 'hbs', 
  defaultLayout: 'main', 
  layoutsDir: __dirname + '/views/layouts/', 
  handlebars: allowInsecurePrototypeAccess(handlebars),
  helpers: {
    paginate,
    customEach: require('./controllers/customEach')
  }
}));
app.set('view engine', 'hbs');

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

app.use('/', thread);

