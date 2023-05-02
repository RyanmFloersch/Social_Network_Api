require('dotenv').config();
const PORT = process.env.PORT || 3000;

const express = require('express');
const db  = require('./config/connection');
const routes = require('./routes');


const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(routes);

db.once('open', () => {
    app.listen(PORT, ()=> {
        console.log(`Server listening on %s`, PORT);
    });
});
