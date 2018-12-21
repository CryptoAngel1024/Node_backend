const {
    Pool
} = require('pg')
const path = require('path')
require('dotenv').config({
    path: path.resolve(__dirname, '../../.env')
})

/**
 * Connection to the db class
 * config data is taken from the .env file
 */

const configPG = {
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.PGPORT,
    host: process.env.PGHOST
}

// Connection Pool instantiation. It is exported into the module.export and called by
// all the API classes that use the connection
const poolPromise = new Pool(configPG)
    .connect()
    .then(pool => {
        console.log('Connected to', configPG.database)
        return pool
    })
    .catch(err => console.log('Database', configPG.database, ' Connection Failed! Bad Config: ', err))

module.exports = {
    poolPromise
};