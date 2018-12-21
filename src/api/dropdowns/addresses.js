const {
    poolPromise
} = require('../../database/connect')

const Addresses = {
    id: {}
}


Addresses.get = async (req, res) => {
    try {
        const {
            buildingID
        } = req.params
        const text = `
        SELECT bua."addressID",ad.street
        FROM "BuildingAddresses" bua
        LEFT JOIN "Addresses" ad ON ad."addressID" = bua."addressID"
        WHERE bua."buildingID" = ${buildingID}
        `
        const pool = await poolPromise
        const result = await pool
            .query(text)
        res.json(result.rows)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}




module.exports = Addresses