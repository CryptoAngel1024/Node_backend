const express = require('express')
const path = require('path')
const apiRoutes = require('./routes/api.routes')
const auth = require('./auth')
const cors = require('cors')

const app = express();

// app.use((req, res, next) => {
//     // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000')
//     // res.setHeader('Access-Control-Allow-Origin', 'https://www.fraunhofer.it')
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type')
//     next()
// })
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({
    extended: true
})) // for parsing application/x-www-form-urlencoded
app.use(cors()) // cors enabler for AWS
app.use('/api', auth) // Check if the user has access to resource
app.use('/api', apiRoutes);
app.use(express.static(path.join(__dirname, "../uploads")))

const port = process.env.PORT || 5000 || 3000; // set the port express will be running on

// app.use(express.static(path.join(__dirname, '../build/')))
// TODO => modify 
// app.get('/', (req, res) => {
// })
// app.get("*", (req, res) => res.sendFile(path.resolve("build", "index.html")));

app.listen(port, () => console.log(`Listening on port ${port}`)); // console log 