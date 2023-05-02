const express = require('express');
const db  = require('./config/connection');
const routes = require('./routes');
require('dotenv');

const cwd = process.cwd();

const app = express();


