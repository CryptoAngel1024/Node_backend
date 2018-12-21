const {
    poolPromise
} = require('../../database/connect')

const Destination = {
    id: {}
}


Destination.get = async (req, res) => {

    try {
        const text = `SELECT "destinationID", "name" FROM public."Destinations"`
        const pool = await poolPromise
        const result = await pool
            .query(text)
        res.json(result.rows)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}




module.exports = Destination