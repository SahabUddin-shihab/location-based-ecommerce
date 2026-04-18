require("dotenv").config()
const errorHandler= require('./middleware/errorHandler');
const express= require('express');
const path= require('path');
const cors= require('cors')
const morgan= require('morgan');

const connectDB= require('./config/database');


connectDB();

const app= express();

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());
// app.use(
//     cors({
//         origin: process.env.CLIENT_URL || 'http://localhost:3000',
//         credentials: true,
//         optionsSuccessStatus: 200
//     })
// );

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
}

app.use('/api/v1',require('./routes/api'));

app.use(errorHandler);

module.exports= app;