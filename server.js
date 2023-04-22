require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const verifyJWT = require('./middlewares/verifyJWT');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3500;
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const credentials = require('./middlewares/credentials');
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: false,
  })
  .then((response) => console.log('connected to DB'));

// middlewares to use
app.use(express.json());
app.use(cookieParser());
app.use(credentials);
app.use(cors(corsOptions));
//GET request for homepage
app.get('/', (req, res) => {
  res.send('hello');
});
//ROUTES
app.use('/register', require('./routes/register'));

// auth route path NB: must be above verify token middleware
app.use('/login', require('./routes/login'));

app.use('/refresh', require('./routes/refresh'));
app.use(verifyJWT);
app.use('/user', require('./routes/user'));
mongoose.connection.once('open', () => {
  app.listen(PORT);
  console.log(`started listening at port ${PORT}`);
});
