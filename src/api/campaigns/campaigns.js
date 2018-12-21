const {
    poolPromise
} = require('../../database/connect')

const Campaign = {
    id: {}
}

const update = new Date()

// API request to create a new campaign

// create a new campaign
Campaign.post = async (req, res) => {
    try {
        const {
            name,
            percentDiscount,
            expireDate,
            campaignType,
            discountedMonths,
            note
        } = req.body
        const text = `
        INSERT INTO public."Campaigns" 
        ("name", "percentDiscount", "expireDate", "creationDate", "campaignType","discountedMonths", "note") 
        VALUES('${name}','${percentDiscount}','${expireDate}','${update.toISOString()}','${campaignType}','${discountedMonths}','${note}')
        `

        const pool = await poolPromise
        const result = await pool.query(text)
        res.json(result)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}

// get all the campaigns
Campaign.get = async (req, res) => {

    try {
        const text = `
        SELECT "campaignID", "name", "percentDiscount", "expireDate", "creationDate", 
        "campaignType", "discountedMonths", "note"
         FROM public."Campaigns"
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

// delete a campaign
Campaign.id.delete = async (req, res) => {

    try {
        const {
            campaignID
        } = req.params
        const text = `
        DO $$
        BEGIN
        DELETE FROM public."CampaignPropertyUnits" WHERE "campaignID" = ${campaignID};
        DELETE FROM public."Campaigns" WHERE "campaignID" = ${campaignID};
        END $$;
        `
        const pool = await poolPromise
        const result = await pool
            .query(text)
        res.json(result)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}




module.exports = Campaign