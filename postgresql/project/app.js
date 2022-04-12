const express = require('express');
const path = require('path');
const {initDb} = require(path.resolve(__dirname, 'services', 'db.service'));
const app = express();

const dbUser = process.env.DB_USER;
const dbUserPassword = process.env.DB_USER_PWD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;

const dbUrl = `postgres://${dbUser}:${dbUserPassword}@${dbHost}:${dbPort}/${dbName}`;

const masterData = require(path.resolve(__dirname, 'routes', 'master-data.router'));

app.use('/master-data', masterData);

function start() {
    app.listen(3000, () => {
        console.log('Application is started');
    });
    initDb(dbUrl);
}


start();
