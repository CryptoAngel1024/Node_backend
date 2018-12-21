const {
    poolPromise
} = require('../../database/connect')

const Type = {
    id: {}
}


Type.get = async (req, res) => {

    try {
        const text = `SELECT "typeID", "name" FROM public."Type"`
        const pool = await poolPromise
        const result = await pool
            .query(text)
        res.json(result.rows)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}




module.exports = Type