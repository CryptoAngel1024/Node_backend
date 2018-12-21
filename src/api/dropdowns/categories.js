const {
    poolPromise
} = require('../../database/connect')

const Category = {
    id: {}
}


Category.get = async (req, res) => {

    try {
        const text = `SELECT "categoryID", "name" FROM public."Categories"`
        const pool = await poolPromise
        const result = await pool
            .query(text)
        res.json(result.rows)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}




module.exports = Category