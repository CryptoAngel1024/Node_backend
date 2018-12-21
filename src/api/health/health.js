const {
    poolPromise
} = require('../../database/connect')

const Health = {}

Health.get = async (req, res) => {
    try {
        const text = `
        SELECT 1 FROM pg_database WHERE datname='halleydb';
        `
        const pool = await poolPromise
        const result = await pool.query(text)
        if (result.rowCount === 1){
            res.sendStatus(200)
        } else {
            res.sendStatus(500)
        }
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}

module.exports = Health