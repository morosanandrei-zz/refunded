const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const chalk = require('chalk');

const connectDB = require('./config/db');

// Load config
dotenv.config({
  path: './config/config.env'
});

connectDB();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Import routes

const categoryRoutes = require('./routes/categories');

app.use('/categories', categoryRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
})

// Start app

const PORT = process.env.PORT || 1338;

app.listen(PORT, () => {
  console.log('\n\nServer running in ' + chalk.blueBright(process.env.NODE_ENV.toUpperCase()) + ' mode on port: ' + chalk.blueBright(PORT));
});