require("dotenv").config()

const express= require('express');
const path= require('path');
const cors= require('cors')

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

app.use('v1',)

module.exports= app;