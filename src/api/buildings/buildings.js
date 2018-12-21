// const sql = require('pg')
const {
    poolPromise
} = require('../../database/connect')
const {
    formatDate
} = require('../../utilities/date')

const Building = {
    id: {}
}


Building.get = async (req, res) => {

    try {
        const text = `
        SELECT bu."buildingID", bu."customCode"
        FROM "Buildings" bu
        `
        const pool = await poolPromise
        const result = await pool
            .query(text)
        res.json(result.rows[0])
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}

// Create a new building

Building.post = async (req, res) => {
    try {
        const {
            customCode,
            initiative,
            company,
            accessories,
            geoArea,
            numFloors,
            destinationID,
            addresses,
            mortgage
        } = req.body
        const text = `
        DO $$
       -- DECLARE destID integer;
        DECLARE mortID integer;
        DECLARE buildID integer;
        DECLARE addID integer;
        BEGIN
	       -- INSERT INTO public."Destinations" (name) VALUES('${destinationID}') RETURNING "destinationID" INTO destID;

            INSERT INTO public."Mortgages" ("agreedValue", "remainingValue", "isFractioned", "rate", "bankName", "installmentAmount",
            "duration", "installmentFreq", "firstPaymentDate", "lastPaymentDate")
            VALUES('${mortgage.agreedValue}','${mortgage.remainingValue}','${mortgage.isFractioned}','${mortgage.rate}','${mortgage.bankName}'
            ,'${mortgage.installmentAmount}','${mortgage.duration}','${mortgage.installmentFreq}','${mortgage.firstPaymentDate}','${mortgage.lastPaymentDate}')
            RETURNING "mortgageID" INTO mortID;

	        INSERT INTO public."Buildings" ("customCode", "initiative", "company", "accessories", "geoArea", "numFloors",
            "destinationID", "mortgageID") 
            VALUES('${customCode}','${initiative}','${company}','${accessories}','${geoArea}','${numFloors}',${destinationID}, mortID) RETURNING "buildingID" INTO buildID;

            ${addresses ? addresses.map((element) => `
            INSERT into public."Addresses" ("province", "CAP", "comune", "street", "region") 
            VALUES('${element.province}','${element.CAP}','${element.comune}','${element.street}','${element.region}') RETURNING "addressID" INTO addID;

            INSERT INTO public."BuildingAddresses" ("buildingID", "addressID")
            VALUES(buildID, addID);

            `).join('') : ''}

        END $$;
        `

        const pool = await poolPromise
        const result = await pool.query(text)
        res.json(result)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}

// Get the a building with ID buildingID information

Building.id.get = async (req, res) => {
    const pool = await poolPromise
    try {
        const {
            buildingID
        } = req.params
        const building = {}
        const text = `SELECT * FROM public."Buildings" WHERE "buildingID" = ($1)`
        const buildingRetrieved = await pool.query(text, [buildingID])

        if (buildingRetrieved.rows.length === 0)
            return res.status(404).end('Not found, resource does not exist.')

        Object.assign(building, buildingRetrieved.rows[0])
        // retrieve destination
        const textDestination = `SELECT name FROM public."Destinations" WHERE "destinationID" = ${building.destinationID}`
        const destinationsRetrieved = await pool.query(textDestination)
        const destination = destinationsRetrieved.rows[0].name
        building.destination = destination
        delete building.destinationID

        // retrieve addresses
        const textAddresses = `SELECT * FROM public."BuildingAddresses"
            JOIN public."Addresses" ON public."BuildingAddresses"."addressID" = 
            public."Addresses"."addressID" 
            WHERE public."BuildingAddresses"."buildingID" = ${buildingID}`
        const addressesRetrieved = await pool.query(textAddresses)
        const addresses = addressesRetrieved.rows.length ? addressesRetrieved.rows : []
        if (addresses.length) {
            const mapAddresses = addresses.map(address => {
                const {
                    province,
                    CAP,
                    comune,
                    street,
                    region
                } = address
                return { province, CAP, comune, street, region }
            })
            building.addresses = mapAddresses
        } else {
            building.addresses = addresses
        }
        // retrieve mortgages
        if (!building.mortgageID)
            building.mortgage = null
        else {
            const textMortgage = `SELECT * FROM public."Mortgages" WHERE "mortgageID" = ${building.mortgageID}`
            const mortgagesRetrieved = await pool.query(textMortgage)
            const mortgage = mortgagesRetrieved.rows.length ? mortgagesRetrieved.rows[0] : null
            // format morgage dates
            if (mortgage) {
                // formatting mortgage values
                mortgage.agreedValue = Number(mortgage.agreedValue)
                mortgage.remainingValue = Number(mortgage.remainingValue)
                mortgage.installmentAmount = Number(mortgage.installmentAmount)
                const firstPaymentDateObj = new Date(mortgage.firstPaymentDate)
                const firstPaymentDate = formatDate(firstPaymentDateObj)
                const lastPaymentDateObj = new Date(mortgage.lastPaymentDate)
                const lastPaymentDate = formatDate(lastPaymentDateObj)
                Object.assign(mortgage, { firstPaymentDate, lastPaymentDate })
                building.mortgage = mortgage
            } else {
                building.mortgage = null
            }
        }
        delete building.mortgageID
        return res.json(building)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}


module.exports = Building