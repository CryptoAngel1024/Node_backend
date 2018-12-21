// const fs = require('fs');
const {
    poolPromise
} = require('../../database/connect')

const Propunit = {
    id: {},
    merge: {},
    split: {}
}

const update = new Date()

// Create a new Property Unit
Propunit.post = async (req, res) => {
    try {

        const {
            customCode,
            buildingID,
            destinationID,
            typeID,
            categoryID,
            mortgage,
            civicNumber,
            floor,
            internalNumber,
            stair,
            unitCode,
            description,
            areaBalcony,
            areaTerrace,
            areaMezzanine,
            areaLoggia,
            areaGarden,
            areaGarret,
            areaOther,
            areaOmoTotal,
            areaTotal,
            areaOmoCoeff,
            energyClass,
            overlooking,
            status,
            assignedTo,
            mngmtCost,
            priceSaleInitial,
            priceSaleListing,
            priceRentMonthly,
            priceRentAnnual,
            ctsFoglio,
            ctsParticella,
            ctsSubalterno,
            ctsIMU,
            ctsRendita,
            ctsNoteRendita,
            addressID
        } = req.body.PU

        const pool = await poolPromise
        // check whether you are creating a new PU or performing a merge

        let isitMerge = "--"
       
        if (req.body.parentsID) {
            isitMerge = `
            UPDATE public."PropertyUnits" SET "isObsolete" = TRUE WHERE "propertyUnitID" IN (${req.body.parentsID});

            -- insert the child PU and parent PUs and save the operation type
            INSERT INTO public."PropertyUnitsOperations" ("propertyUnitID", "parentPUs", "operationType", "creationDate") 
            VALUES(puID, ARRAY[${req.body.parentsID}],'merge', '${update.toISOString()}');
            `
        }

        const text = `
        DO $$
            DECLARE 
                mortID integer; 
                puID integer;
            BEGIN
            INSERT INTO public."Mortgages" ("agreedValue", "remainingValue", "isFractioned", "rate", "bankName", "installmentAmount",
            "duration", "installmentFreq", "firstPaymentDate", "lastPaymentDate")
            VALUES('${mortgage.agreedValue}','${mortgage.remainingValue}','${mortgage.isFractioned}','${mortgage.rate}','${mortgage.bankName}'
            ,'${mortgage.installmentAmount}','${mortgage.duration}','${mortgage.installmentFreq}','${mortgage.firstPaymentDate}','${mortgage.lastPaymentDate}')
            RETURNING "mortgageID" INTO mortID;

            INSERT INTO public."PropertyUnits" ("customCode","buildingID","destinationID","typeID","categoryID","mortgageID","civicNumber",
            "floor","internalNumber","stair","unitCode","creationDate","lastUpdate","description","areaBalcony","areaTerrace","areaMezzanine",
            "areaLoggia","areaGarden","areaGarret","areaOmoTotal","areaTotal","areaOmoCoeff","energyClass","overlooking",
            "status","assignedTo","mngmtCost","priceSaleInitial","priceSaleListing","priceRentMonthly","priceRentAnnual","ctsFoglio","ctsParticella",
            "ctsSubalterno","ctsIMU","ctsRendita","ctsNoteRendita", "addressID", "areaOther") 
            VALUES('${customCode}','${buildingID}','${destinationID}','${typeID}','${categoryID}',mortID,'${civicNumber}','${floor}','${internalNumber}',
            '${stair}','${unitCode}','${update.toISOString()}','${update.toISOString()}','${description}','${areaBalcony}','${areaTerrace}','${areaMezzanine}','${areaLoggia}','${areaGarden}',
            '${areaGarret}','${areaOmoTotal}','${areaTotal}','${areaOmoCoeff}','${energyClass}','${overlooking}','${status}',
            '${assignedTo}','${mngmtCost}','${priceSaleInitial}','${priceSaleListing}','${priceRentMonthly}','${priceRentAnnual}','${ctsFoglio}','${ctsParticella}',
            '${ctsSubalterno}','${ctsIMU}','${ctsRendita}','${ctsNoteRendita}','${addressID}', '${areaOther}')
            RETURNING "propertyUnitID" INTO puID;
            
            ${isitMerge}
            END $$;
        `
        // TODO: unitCode is to be deleted? add "altro" 

        const result = await pool.query(text)
        res.json(result)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}

// edit a property unit

Propunit.id.put = async (req, res) => {
    try {
        const {
            propertyUnitID
        } = req.params
        const {
            customCode,
            destinationID,
            typeID,
            categoryID,
            mortgage,
            civicNumber,
            floor,
            internalNumber,
            stair,
            unitCode,
            description,
            areaBalcony,
            areaTerrace,
            areaMezzanine,
            areaLoggia,
            areaGarden,
            areaGarret,
            areaOmoTotal,
            areaTotal,
            areaOther,
            areaOmoCoeff,
            energyClass,
            overlooking,
            status,
            assignedTo,
            mngmtCost,
            priceSaleInitial,
            priceSaleListing,
            priceRentMonthly,
            priceRentAnnual,
            ctsFoglio,
            ctsParticella,
            ctsSubalterno,
            ctsIMU,
            ctsRendita,
            ctsNoteRendita,
            campaignIDs
        } = req.body.PU

        const pool = await poolPromise

        // check if we are performing a merge request or not
        let isitMerge = "--"
       
        if (req.body.parentsID) {
            isitMerge = `
            UPDATE public."PropertyUnits" SET "isObsolete" = TRUE WHERE "propertyUnitID" IN (${req.body.parentsID});

            -- insert the child PU and parent PUs and save the operation type
            INSERT INTO public."PropertyUnitsOperations" ("propertyUnitID", "parentPUs", "operationType", "creationDate") 
            VALUES(${propertyUnitID}, ARRAY[${req.body.parentsID}],'merge', '${update.toISOString()}');
            `
        }


        const text = `
        DO $$
        DECLARE mortID integer;
        BEGIN
        mortID = (SELECT "mortgageID" FROM public."PropertyUnits" WHERE "propertyUnitID" = ${propertyUnitID});
    
        UPDATE public."PropertyUnits" SET "customCode" = '${customCode}', "destinationID" = ${destinationID}, "typeID" = ${typeID}, "categoryID" = ${categoryID}, "civicNumber" = '${civicNumber}',
        "floor" = '${floor}',"internalNumber" = '${internalNumber}', "stair" = '${stair}', "unitCode" = '${unitCode}', "lastUpdate" = '${update.toISOString()}', "description" = '${description}',
        "areaBalcony" = ${areaBalcony}, "areaTerrace" = ${areaTerrace}, "areaMezzanine" = ${areaMezzanine}, "areaLoggia" = ${areaLoggia}, "areaGarden" = ${areaGarden}, "areaOther" = '${areaOther}',
        "areaGarret" = ${areaGarret}, "areaOmoTotal" = ${areaOmoTotal}, "areaTotal" = ${areaTotal}, "areaOmoCoeff" = ${areaOmoCoeff}, "energyClass" = '${energyClass}',
        "overlooking" = '${overlooking}', 
       
        "status" = '${status}', "assignedTo" = '${assignedTo}',
        "mngmtCost" = ${mngmtCost}, "priceSaleInitial" = ${priceSaleInitial}, "priceSaleListing" = ${priceSaleListing}, "priceRentMonthly" = ${priceRentMonthly}, "priceRentAnnual" = ${priceRentAnnual},
        "ctsFoglio" = '${ctsFoglio}', "ctsParticella" = '${ctsParticella}', "ctsSubalterno" = '${ctsSubalterno}', "ctsIMU" = ${ctsIMU}, "ctsRendita" = '${ctsRendita}', "ctsNoteRendita" = '${ctsNoteRendita}', "isObsolete" = FALSE
        WHERE "propertyUnitID" = ${propertyUnitID};

        DELETE FROM public."CampaignPropertyUnits" WHERE "propertyUnitID" = ${propertyUnitID};
        ${campaignIDs ? campaignIDs.map((element) => `
        INSERT INTO public."CampaignPropertyUnits" ("campaignID", "propertyUnitID") 
        VALUES('${element}','${propertyUnitID}');
        `).join('') : ''}

       UPDATE public."Mortgages" SET "agreedValue" = ${mortgage.agreedValue}, "remainingValue" = ${mortgage.remainingValue}, "isFractioned" = ${mortgage.isFractioned},
       "rate" = ${mortgage.rate}, "bankName" = '${mortgage.bankName}', "installmentAmount" = ${mortgage.installmentAmount}, "duration" = '${mortgage.duration}', 
       "installmentFreq" = '${mortgage.installmentFreq}', "firstPaymentDate" = '${mortgage.firstPaymentDate}', "lastPaymentDate" = '${mortgage.lastPaymentDate}'
       WHERE "mortgageID" = mortID;

        ${isitMerge}

        END $$;
        `

        const result = await pool.query(text)
        res.json(result)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}


// get all property units
Propunit.get = async (req, res) => {

    try {

        const {
            operationType,
            buildingID,
            pageSize,
            pageNumber,
            role
        } = req.query

        const pool = await poolPromise

        // check that pageSize is > 0 or "all"
        if(pageSize === "all" || pageSize > 0) {
        if (operationType === "merge" && buildingID) {

            // return all non obsolete PU given a specific building id and operationType = merge

            const getForMerge = `
            SELECT bu."buildingID", bu."customCode", bu.initiative, bu.company, de.name as "destination",
            (SELECT json_agg(data_rows)
            FROM(
            SELECT json_build_object(
            'propertyUnitID', pu."propertyUnitID",
            'customCode', pu."customCode",
            'civicNumber', pu."civicNumber",
            'stair', pu."stair",
            'internalNumber', pu."internalNumber"
            ) as "propertyUnit" FROM "PropertyUnits" pu
            WHERE pu."buildingID" = bu."buildingID" AND pu."isObsolete" = false
            ) as data_rows) as "propertyUnits"
            FROM public."Buildings" bu
            LEFT JOIN "Destinations" de ON de."destinationID" = bu."destinationID"
            WHERE bu."buildingID" = ${buildingID}
            `
            const result = await pool
                .query(getForMerge)
            res.json(result.rows)

        } else if (operationType === "split" && buildingID) {

            // return all non obsolete PU given a specific building id and operationType = split

            const getForSplit = `
            SELECT bu."buildingID", bu."customCode", bu.initiative, bu.company, de.name as "destination",
            (SELECT json_agg(data_rows)
            FROM(
            SELECT json_build_object(
            'propertyUnitID', pu."propertyUnitID",
            'customCode', pu."customCode",
            'civicNumber', pu."civicNumber",
            'stair', pu."stair",
            'internalNumber', pu."internalNumber"
            ) as "propertyUnit" FROM "PropertyUnits" pu
            LEFT JOIN "PropertyUnitsOperations" puo ON puo."propertyUnitID" = pu."propertyUnitID"
            WHERE pu."buildingID" = bu."buildingID" AND pu."isObsolete" = false AND puo."operationType" = 'merge'
            ) as data_rows) as "propertyUnits"
            FROM public."Buildings" bu
            LEFT JOIN "Destinations" de ON de."destinationID" = bu."destinationID"
            WHERE bu."buildingID" = ${buildingID}
            `

            const result = await pool
                .query(getForSplit)
            
            // delete any duplicate pu in the list, since each merge is stored multiple times (for log purposes)
            const filteredPUs = Object.values(result.rows[0].propertyUnits.reduce((acc,cur)=>Object.assign(acc,{[cur.propertyUnit.propertyUnitID]:cur}),{}))
            // assign th filtered object to the final result
            result.rows[0].propertyUnits = filteredPUs

            res.json(result.rows[0])

        } else {

            let page = null
            let isAdminCondition = 'WHERE pu."isObsolete" = false'
            if (role === "Admin") isAdminCondition = "--"

            if (pageNumber != null && pageNumber !== 0 && pageSize !== 0 && pageSize != null) {
                page = pageNumber * pageSize
            }

            const text = `
            SELECT 
            -- part of non expanded line
            pu."propertyUnitID", pu.status, pu."customCode", bu."customCode", bu.company,
            bu.initiative, dest."name" as "destinationName", ty."name" as "typeName", cat."name" as "categoryName", bu."geoArea", pu."assignedTo", 
            pu."creationDate", pu."lastUpdate", 
            -- part of expanded line
            -- dati anagrafici
            (SELECT ad.street FROM "Addresses" ad WHERE pu."addressID" = ad."addressID") as "address", pu.stair, pu."floor", pu."internalNumber", 
            -- dati catastali
            pu."ctsFoglio", pu."ctsParticella", pu."ctsSubalterno", pu."ctsIMU", pu."ctsRendita", 
            -- dati tecnici
            pu."areaTotal", pu."areaBalcony", pu."areaTerrace", pu."areaMezzanine", pu."areaLoggia",  pu."areaOther",
            pu."areaGarden", pu."areaGarret", pu."areaOmoTotal", 
            -- mutuo
            mort."bankName", mort.duration, mort."installmentFreq", mort.rate,
            mort."firstPaymentDate", mort."lastPaymentDate", mort."isFractioned", -- rate residue? (da calcolare?)
            -- listino vendite
            pu."priceSaleListing", mort."agreedValue", mort."remainingValue", 
            -- listino locazione
            pu."priceRentAnnual", pu."priceRentMonthly", pu."mngmtCost", -- rata mutuo mensile? (da calcolare?)
            -- campagne
            (SELECT json_agg(data_rows)
            FROM(
            SELECT json_build_object(
            'name',cam."name",
            'campaignType', cam."campaignType",
            'percentDiscount', cam."percentDiscount",
            'discountedMonths', cam."discountedMonths"
            ) as "campaign" FROM "Campaigns" cam 
            LEFT JOIN "CampaignPropertyUnits" cpu ON cpu."campaignID" = cam."campaignID"
            WHERE cpu."propertyUnitID" = pu."propertyUnitID"
            )as data_rows)as "activeCampaigns"
            -- end of query
            FROM "PropertyUnits" pu
            LEFT JOIN "Categories" cat ON cat."categoryID" = pu."categoryID"
            LEFT JOIN "Type" ty ON ty."typeID" = pu."typeID"
            LEFT JOIN "Buildings" bu ON bu."buildingID" = pu."buildingID"
            LEFT JOIN "Mortgages" mort ON mort."mortgageID" = pu."mortgageID"
            LEFT JOIN "Destinations" dest ON dest."destinationID" = pu."destinationID"
            ${isAdminCondition}
            ORDER BY pu."propertyUnitID" ASC
            LIMIT ${pageSize} OFFSET ${page}
        `
            const result = await pool
                .query(text)
            res.json(result.rows)
        }
    } else {
        req.pause();
        res.status(400);
        res.end('something went wrong with your request');
    }
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}

// get all a specific prop unit
Propunit.id.get = async (req, res) => {
    try {
        const {
            propertyUnitID
        } = req.params
        const text = `
        SELECT 
        -- part of non expanded line
        pu."propertyUnitID", pu.status, pu."customCode", bu."customCode", bu.company,
        bu.initiative, dest."name" as "destinationName", ty."name" as "typeName", cat."name" as "categoryName", bu."geoArea", pu."assignedTo", 
        pu."creationDate", pu."lastUpdate", 
        -- part of expanded line
        -- dati anagrafici
        (SELECT ad.street FROM "Addresses" ad WHERE pu."addressID" = ad."addressID") as "address", pu."civicNumber", pu.stair, pu."floor", pu."internalNumber", 
        -- dati catastali
        pu."ctsFoglio", pu."ctsParticella", pu."ctsSubalterno", pu."ctsIMU", pu."ctsRendita", pu."ctsNoteRendita",
        -- dati tecnici
        pu.description, pu."areaTotal", pu."areaBalcony", pu."areaTerrace", pu."areaMezzanine", pu."areaLoggia", pu."areaOther",
        pu."areaGarden", pu."areaGarret", pu."areaOmoTotal", pu.description, pu."energyClass",
        pu.overlooking, 
        -- mutuo
        mort."bankName", mort.duration, mort."installmentFreq", mort.rate, mort."installmentAmount",
        mort."firstPaymentDate", mort."lastPaymentDate", mort."isFractioned", -- rate residue? (da calcolare? SI)
        -- listino vendite
        pu."priceSaleListing", pu."priceSaleInitial", mort."agreedValue", mort."remainingValue", 
        -- listino locazione
        pu."priceRentAnnual", pu."priceRentMonthly", pu."mngmtCost", -- rata mutuo mensile? (da calcolare? dovrebbe essere installmentAmount)
        -- dropdowns
        pu."buildingID", pu."categoryID", pu."typeID", pu."destinationID", pu."addressID", pu."mortgageID"
        FROM "PropertyUnits" pu
        LEFT JOIN "Categories" cat ON cat."categoryID" = pu."categoryID"
        LEFT JOIN "Type" ty ON ty."typeID" = pu."typeID"
        LEFT JOIN "Buildings" bu ON bu."buildingID" = pu."buildingID"
        LEFT JOIN "Mortgages" mort ON mort."mortgageID" = pu."mortgageID"
        LEFT JOIN "Destinations" dest ON dest."destinationID" = pu."destinationID"
		WHERE pu."propertyUnitID" = ${propertyUnitID}
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

// API request to delete a specific user

Propunit.id.delete = async (req, res) => {

    try {
        const {
            propertyUnitID
        } = req.params
        const text = `
        DO $$
        BEGIN
        UPDATE public."PropertyUnits" SET "isObsolete" = TRUE WHERE "propertyUnitID" = ${propertyUnitID};
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


// Create a new Property Unit via merge operation
/**
 *  starting with selecting the property unit to be merged
 *  input: ids of the pu to be selected
 *  output: post query that uses the data from the parents in its request
 */
Propunit.merge.post = async (req, res) => {
    try {
        const {
            propertyUnitIDs
        } = req.body

        const pool = await poolPromise
        
        // sort propertyUnitIDs array in ascending order (the ids need to be stored in the same way for the checkPreviousMerge function to work correctly)
        propertyUnitIDs.sort()

        // check if the Parents PU have any active campaigns. If yes prompt an error message and block the merge operation.
        const checkCampaigns = `
            SELECT DISTINCT cpu."campaignID"
            FROM "public"."PropertyUnits" pu 
            LEFT JOIN "public"."CampaignPropertyUnits" cpu ON cpu."propertyUnitID" = pu."propertyUnitID"
            WHERE pu."propertyUnitID" IN (${propertyUnitIDs})
        `

        const campaigns = (await pool.query(checkCampaigns)).rows
        const campaignList = []
        campaigns.forEach(element => {
            campaignList.push(element.campaignID)
        })
       
        if (campaignList.length === 0 || campaignList.some(element => element === null)){

        // check if the array of property units is already associated with a previous merge

        let wasMerged = false
        let oldMerge = 0

        const checkPreviousMerge = `
        DO $$
        DECLARE test INTEGER;
        BEGIN
        test = (SELECT DISTINCT puo."propertyUnitID"
        FROM "PropertyUnitsOperations" puo
        WHERE ARRAY [${propertyUnitIDs}]::int[] = "parentPUs");

        IF NOT FOUND THEN 
            raise exception '%',
            test;
        END IF;
        END
        $$
        `

        // check if the PU in consideration was already merged or not
        await pool.query(checkPreviousMerge).catch(error => {
            if (error.message === '<NULL>') wasMerged = false
            else {
                wasMerged = true
                oldMerge = parseInt(error.message, 10)
            }
        });

        if (wasMerged === false) {

            /**
             * if the body contains propertyUnitIDs return the a 
             * JSON object with the merged data from the parents
             */

                // get info of parent PUs
                const getParentInfo = `
                    SELECT 
                    -- part of non expanded line
                    pu."propertyUnitID", pu.status, pu."customCode" as "codice",bu."customCode" as "fabbricato", bu.company as "società",
                    bu.initiative as "iniziativa", dest."name" as "destinazione", ty."name" as "tipo", cat."name" as "categoria", bu."geoArea", pu."assignedTo" as "venditore", 
                    pu."creationDate", pu."lastUpdate", 
                    -- part of expanded line
                    -- dati anagrafici
                    (SELECT ad.street FROM "Addresses" ad WHERE pu."addressID" = ad."addressID") as "indirizzo", pu."civicNumber" as "civico", pu.stair as "scala", pu."floor" as "piano", pu."internalNumber" as "interno", 
                    -- dati catastali
                    pu."ctsFoglio" as "foglio", pu."ctsParticella" as "particella", pu."ctsSubalterno" as "subalterno", pu."ctsIMU" as "imu", pu."ctsRendita" as "renditaCatastale", pu."ctsNoteRendita",
                    -- dati tecnici
                    pu.description as "descrizione", pu."areaTotal" as "unitàImmobiliare", pu."areaBalcony" as "balcone", pu."areaTerrace" as "terrazzo", pu."areaMezzanine" as "soppalco", pu."areaLoggia" as "loggia", pu."areaOther" as "altro",
                    pu."areaGarden" as "giardino", pu."areaGarret" as "mansarda", pu."areaOmoTotal" as "omogeneizzati", pu.description as "descrizione", pu."energyClass" as "classeEnergetica",
                    pu.overlooking as "affaccio", 
                    -- mutuo
                    mort."bankName" as "banca", mort.duration as "durata", mort."installmentFreq" as "cadenzaRata", mort.rate as "tasso", mort."installmentAmount" as "importoRata",
                    mort."firstPaymentDate" as "primaRata", mort."lastPaymentDate" as "ultimaRata", mort."isFractioned" as "frazionato", -- rate residue? (da calcolare?)
                    -- listino vendite
                    pu."priceSaleListing" as "prezzoVendita", pu."priceSaleInitial" as "prezzoIniziale", mort."agreedValue" as "mutuoAccordato", mort."remainingValue" as "mutuoResiduo", 
                    -- listino locazione
                    pu."priceRentAnnual" as "canoneAnnuale", pu."priceRentMonthly" as "canoneMensile", pu."mngmtCost" as "oneriDiGestione", -- rata mutuo mensile? (da calcolare?)
                    -- dropdowns
                    pu."buildingID", pu."categoryID", pu."typeID", pu."destinationID", pu."addressID", pu."mortgageID"
                    FROM "PropertyUnits" pu
                    LEFT JOIN "Categories" cat ON cat."categoryID" = pu."categoryID"
                    LEFT JOIN "Type" ty ON ty."typeID" = pu."typeID"
                    LEFT JOIN "Buildings" bu ON bu."buildingID" = pu."buildingID"
                    LEFT JOIN "Mortgages" mort ON mort."mortgageID" = pu."mortgageID"
                    LEFT JOIN "Destinations" dest ON dest."destinationID" = pu."destinationID"
		                WHERE pu."propertyUnitID" IN (${propertyUnitIDs})
                    `
                const parentInfo = await pool.query(getParentInfo)

                // prepare object for body request
                const mergedData = {
                    // PU ANAGRAPHICAL DATA
                    mergedInterno: [],
                    mergedScala: [],
                    mergedCivico: [],
                    mergedPiano: [],
                    mergedEdificio: 0,
                    mergedIndirizzo: [], // dropdown 
                    mergedDestinazione: [], // dropdown
                    mergedTipo: [], // dropdwon 
                    mergedCategoria: [], // dropdown 
                    mergedAreaGeografica: [],

                    // TECHNIAL DATA
                    mergedDescription: [],
                    mergedUnitaImmobiliare: [],
                    mergedBalcone: [],
                    mergedTerrazzo: [],
                    mergedSoppalco: [],
                    mergedMansarda: [],
                    mergedLoggia: [],
                    mergedGiardino: [],
                    mergedAltro: [],
                    mergedMQOmogeneizzati: [],
                    mergedClasseEnergetica: [],
                    mergedAffaccio: [],
                    mergedFotoImmobile: [],
                    mergedPlanimetria: [],

                    // COMMERCIAL DATA
                    mergedVenditore: [],
                    mergedOneriGestione: [],
                    mergedPrezzoVendita: [],
                    mergedPrezzoIniziale: [],
                    mergedPrezzoLocazioneMensile: [],
                    mergedPrezzoLocazioneAnnuale: [],

                    // CADASTRAL DATA
                    mergedFoglio: [],
                    mergedParticella: [],
                    mergedSubalterno: [],
                    mergedIMU: [],
                    mergedRenditaCatastale: [],
                    mergedNote: [],

                    // MORTGAGE
                    mergedMortgage: {
                        agreedValue: [],
                        remainingValue: [],
                        isFractioned: [],
                        rate: [],
                        bankName: [],
                        installmentAmount: [],
                        duration: [],
                        installmentFreq: [],
                        firstPaymentDate: [],
                        lastPaymentDate: []
                    }


                }

                // fill the object with the data ready to be merged
                parentInfo.rows.forEach(element => {
                    // PU ANAGRAPHICAL DATA 
                    mergedData.mergedInterno.push(element.interno)
                    mergedData.mergedScala.push(element.scala)
                    mergedData.mergedCivico.push(element.civico)
                    mergedData.mergedPiano.push(element.piano)
                    mergedData.mergedIndirizzo.push(element.addressID) // dropdown
                    mergedData.mergedDestinazione.push(element.destinationID) // dropdown
                    mergedData.mergedTipo.push(element.typeID) // dropdown
                    mergedData.mergedCategoria.push(element.categoryID) // dropdwon
                    mergedData.mergedAreaGeografica.push(element.geoArea)
                    mergedData.mergedEdificio = element.buildingID

                    // TECHNICAL DATA 
                    mergedData.mergedDescription.push(element.descrizione)
                    mergedData.mergedUnitaImmobiliare.push(element.unitàImmobiliare)
                    mergedData.mergedBalcone.push(element.balcone)
                    mergedData.mergedTerrazzo.push(element.terrazzo)
                    mergedData.mergedSoppalco.push(element.soppalco)
                    mergedData.mergedMansarda.push(element.mansarda)
                    mergedData.mergedLoggia.push(element.loggia)
                    mergedData.mergedGiardino.push(element.giardino)
                    mergedData.mergedAltro.push(element.altro)
                    mergedData.mergedMQOmogeneizzati.push(element.omogeneizzati)
                    mergedData.mergedClasseEnergetica.push(element.classeEnergetica)
                    mergedData.mergedAffaccio.push(element.affaccio)
                
                    // COMMERCIAL DATA 
                    mergedData.mergedVenditore.push(element.venditore)
                    mergedData.mergedOneriGestione.push(parseFloat(element.oneriDiGestione))
                    mergedData.mergedPrezzoVendita.push(parseFloat(element.prezzoVendita))
                    mergedData.mergedPrezzoIniziale.push(parseFloat(element.prezzoIniziale))
                    mergedData.mergedPrezzoLocazioneMensile.push(parseFloat(element.canoneMensile))
                    mergedData.mergedPrezzoLocazioneAnnuale.push(parseFloat(element.canoneAnnuale))

                    // CADASTRAL DATA 
                    mergedData.mergedFoglio.push(element.foglio)
                    mergedData.mergedParticella.push(element.particella)
                    mergedData.mergedSubalterno.push(element.subalterno)
                    mergedData.mergedIMU.push(parseFloat(element.imu))
                    mergedData.mergedRenditaCatastale.push(parseFloat(element.renditaCatastale))
                    mergedData.mergedNote.push(element.ctsNoteRendita)

                    // MORTGAGE
                    mergedData.mergedMortgage.agreedValue.push(element.mutuoAccordato)
                    mergedData.mergedMortgage.remainingValue.push(element.mutuoResiduo)
                    mergedData.mergedMortgage.isFractioned.push(element.frazionato)
                    mergedData.mergedMortgage.rate.push(element.tasso)
                    mergedData.mergedMortgage.bankName.push(element.banca)
                    mergedData.mergedMortgage.installmentAmount.push(parseFloat(element.importoRata))
                    mergedData.mergedMortgage.duration.push(element.durata)
                    mergedData.mergedMortgage.installmentFreq.push(element.cadenzaRata)
                    mergedData.mergedMortgage.firstPaymentDate.push(element.primaRata)
                    mergedData.mergedMortgage.lastPaymentDate.push(element.ultimaRata)


                })

                /** dorpdowns check: 
                 *  check if the dropdowns IDs are coherent for the parents PU, if not send them empty
                 */
                
                // address
                if (mergedData.mergedIndirizzo.every((val, i, arr) => val === arr[0])) {
                    // eslint-disable-next-line prefer-destructuring
                    mergedData.mergedIndirizzo = mergedData.mergedIndirizzo[0]
                } else {
                    mergedData.mergedIndirizzo = null
                }

                // destination
                if (mergedData.mergedDestinazione.every((val, i, arr) => val === arr[0])) {
                    // eslint-disable-next-line prefer-destructuring
                    mergedData.mergedDestinazione = mergedData.mergedDestinazione[0]
                } else {
                    mergedData.mergedDestinazione = null
                }

                // type
                if (mergedData.mergedTipo.every((val, i, arr) => val === arr[0])) {
                    // eslint-disable-next-line prefer-destructuring
                    mergedData.mergedTipo = mergedData.mergedTipo[0]
                } else {
                    mergedData.mergedTipo = null
                }

                // category 
                if (mergedData.mergedCategoria.every((val, i, arr) => val === arr[0])) {
                    // eslint-disable-next-line prefer-destructuring
                    mergedData.mergedCategoria = mergedData.mergedCategoria[0]
                } else {
                    mergedData.mergedCategoria = null
                }

                /** mortgage check: check wether the mortgage data of the parent PUs are equal, if not return them blank
                 *  the only data to be summed is the installmentAmount
                 */

                // agreed value
                if (mergedData.mergedMortgage.agreedValue.every((val, i, arr) => val === arr[0])) {
                    // eslint-disable-next-line prefer-destructuring
                    mergedData.mergedMortgage.agreedValue = mergedData.mergedMortgage.agreedValue[0]
                } else {
                    mergedData.mergedMortgage.agreedValue = null
                }

                // remaining value
                if (mergedData.mergedMortgage.remainingValue.every((val, i, arr) => val === arr[0])) {
                    // eslint-disable-next-line prefer-destructuring
                    mergedData.mergedMortgage.remainingValue = mergedData.mergedMortgage.remainingValue[0]
                } else {
                    mergedData.mergedMortgage.remainingValue = null
                }

                // is fractioned
                if (mergedData.mergedMortgage.isFractioned.every((val, i, arr) => val === arr[0])) {
                    // eslint-disable-next-line prefer-destructuring
                    mergedData.mergedMortgage.isFractioned = mergedData.mergedMortgage.isFractioned[0]
                } else {
                    mergedData.mergedMortgage.isFractioned = false
                }

                // rate
                if (mergedData.mergedMortgage.rate.every((val, i, arr) => val === arr[0])) {
                    // eslint-disable-next-line prefer-destructuring
                    mergedData.mergedMortgage.rate = mergedData.mergedMortgage.rate[0]
                } else {
                    mergedData.mergedMortgage.rate = null
                }

                // bank name
                if (mergedData.mergedMortgage.bankName.every((val, i, arr) => val === arr[0])) {
                    // eslint-disable-next-line prefer-destructuring
                    mergedData.mergedMortgage.bankName = mergedData.mergedMortgage.bankName[0]
                } else {
                    mergedData.mergedMortgage.bankName = null
                }

                // sum of installment amount
                mergedData.mergedMortgage.installmentAmount = mergedData.mergedMortgage.installmentAmount.reduce((a, b) => a + b, 0)

                // duration
                if (mergedData.mergedMortgage.duration.every((val, i, arr) => val === arr[0])) {
                    // eslint-disable-next-line prefer-destructuring
                    mergedData.mergedMortgage.duration = mergedData.mergedMortgage.duration[0]
                } else {
                    mergedData.mergedMortgage.duration = null
                }

                // installment frequency
                if (mergedData.mergedMortgage.installmentFreq.every((val, i, arr) => val === arr[0])) {
                    // eslint-disable-next-line prefer-destructuring
                    mergedData.mergedMortgage.installmentFreq = mergedData.mergedMortgage.installmentFreq[0]
                } else {
                    mergedData.mergedMortgage.installmentFreq = null
                }

                // first payment date
                if (mergedData.mergedMortgage.firstPaymentDate.every((val, i, arr) => val === arr[0])) {
                    // eslint-disable-next-line prefer-destructuring
                    mergedData.mergedMortgage.firstPaymentDate = mergedData.mergedMortgage.firstPaymentDate[0]
                } else {
                    mergedData.mergedMortgage.firstPaymentDate = 'infinity'
                }

                // last payment date 
                if (mergedData.mergedMortgage.lastPaymentDate.every((val, i, arr) => val === arr[0])) {
                    // eslint-disable-next-line prefer-destructuring
                    mergedData.mergedMortgage.lastPaymentDate = mergedData.mergedMortgage.lastPaymentDate[0]
                } else {
                    mergedData.mergedMortgage.lastPaymentDate = 'infinity'
                }

                // start populating the object that will be used for the post request
                const postBody = {

                    // MORTGAGE 
                    mortgage: mergedData.mergedMortgage,


                    // ANAGRAPHICAL DATA 
                    customCode: 0,
                    civicNumber: mergedData.mergedCivico.toString(),
                    floor: mergedData.mergedPiano.toString(),
                    internalNumber: mergedData.mergedInterno.toString(),
                    stair: mergedData.mergedScala.toString(),
                    // to be selected from the dropdowns 
                    buildingID: mergedData.mergedEdificio,
                    destinationID: mergedData.mergedDestinazione,
                    typeID: mergedData.mergedTipo,
                    categoryID: mergedData.mergedCategoria,
                    addressID: mergedData.mergedIndirizzo,
                    geoArea: mergedData.mergedAreaGeografica[0],

                    // TECHNICAL DATA
                    unitCode:"this is a test",
                    description: mergedData.mergedDescription.toString(),
                    areaBalcony: mergedData.mergedBalcone.reduce((a, b) => a + b, 0),
                    areaTerrace: mergedData.mergedTerrazzo.reduce((a, b) => a + b, 0),
                    areaMezzanine: mergedData.mergedSoppalco.reduce((a, b) => a + b, 0),
                    areaLoggia: mergedData.mergedLoggia.reduce((a, b) => a + b, 0),
                    areaGarden: mergedData.mergedGiardino.reduce((a, b) => a + b, 0),
                    areaGarret: mergedData.mergedMansarda.reduce((a, b) => a + b, 0),
                    areaOmoTotal: mergedData.mergedMQOmogeneizzati.reduce((a, b) => a + b, 0),
                    areaTotal: mergedData.mergedUnitaImmobiliare.reduce((a, b) => a + b, 0),
                    areaOther: mergedData.mergedAltro.reduce((a, b) => a + b, 0),
                    areaOmoCoeff: 0,
                    energyClass: mergedData.mergedClasseEnergetica.toString(),
                    overlooking: mergedData.mergedAffaccio.toString(),
        
                    // COMMERCIAL DATA done
                    assignedTo: mergedData.mergedVenditore.toString(),
                    mngmtCost: mergedData.mergedOneriGestione.reduce((a, b) => a + b, 0),
                    priceSaleInitial: mergedData.mergedPrezzoIniziale.reduce((a, b) => a + b, 0),
                    priceSaleListing: mergedData.mergedPrezzoVendita.reduce((a, b) => a + b, 0),
                    priceRentMonthly: mergedData.mergedPrezzoLocazioneMensile.reduce((a, b) => a + b, 0),
                    priceRentAnnual: mergedData.mergedPrezzoLocazioneAnnuale.reduce((a, b) => a + b, 0),

                    // CATASTRAL DATA done
                    ctsFoglio: mergedData.mergedFoglio.toString(),
                    ctsParticella: mergedData.mergedParticella.toString(),
                    ctsSubalterno: mergedData.mergedSubalterno.toString(),
                    ctsIMU: mergedData.mergedIMU.reduce((a, b) => a + b, 0),
                    ctsRendita: mergedData.mergedRenditaCatastale.reduce((a, b) => a + b, 0),
                    ctsNoteRendita: mergedData.mergedNote.toString(),
                    // other stuff for the moment

                    status: "libero",

                }

                res.json(
                    {
                    requestType: "POST",
                    endpoint: "/propunit/",
                    parentsID: propertyUnitIDs,
                    PU: postBody
                })

        } else if (wasMerged === true) {
           
            const getPreviousMerge = `
            SELECT 
            -- part of non expanded line
            pu."propertyUnitID", pu.status, pu."customCode", bu."customCode", bu.company,
            bu.initiative, dest."name" as "destinationName", ty."name" as "typeName", cat."name" as "categoryName", bu."geoArea", pu."assignedTo", 
            pu."creationDate", pu."lastUpdate", 
            -- part of expanded line
            -- dati anagrafici
            (SELECT ad.street FROM "Addresses" ad WHERE pu."addressID" = ad."addressID") as "address", pu."civicNumber", pu.stair, pu."floor", pu."internalNumber", 
            -- dati catastali
            pu."ctsFoglio", pu."ctsParticella", pu."ctsSubalterno", pu."ctsIMU", pu."ctsRendita", pu."ctsNoteRendita",
            -- dati tecnici
            pu.description, pu."areaTotal", pu."areaBalcony", pu."areaTerrace", pu."areaMezzanine", pu."areaLoggia", pu."areaOther",
            pu."areaGarden", pu."areaGarret", pu."areaOmoTotal", pu.description, pu."energyClass",
            pu.overlooking,
            -- mutuo
            -- mort."bankName", mort.duration, mort."installmentFreq", mort.rate, mort."installmentAmount",
            -- mort."firstPaymentDate", mort."lastPaymentDate", mort."isFractioned", -- rate residue? (da calcolare? SI)
            -- listino vendite
            pu."priceSaleListing", pu."priceSaleInitial", -- mort."agreedValue", mort."remainingValue", 
            -- listino locazione
            pu."priceRentAnnual", pu."priceRentMonthly", pu."mngmtCost", -- rata mutuo mensile? (da calcolare? dovrebbe essere installmentAmount)
            -- dropdowns
            pu."buildingID", pu."categoryID", pu."typeID", pu."destinationID", pu."addressID", pu."mortgageID",
            -- areaOmoCoeff
            pu."areaOmoCoeff"


            FROM "PropertyUnits" pu
            LEFT JOIN "Categories" cat ON cat."categoryID" = pu."categoryID"
            LEFT JOIN "Type" ty ON ty."typeID" = pu."typeID"
            LEFT JOIN "Buildings" bu ON bu."buildingID" = pu."buildingID"
            LEFT JOIN "Mortgages" mort ON mort."mortgageID" = pu."mortgageID"
            LEFT JOIN "Destinations" dest ON dest."destinationID" = pu."destinationID"
	     	WHERE pu."propertyUnitID" = ${oldMerge}
            `

            const result = (await pool.query(getPreviousMerge)).rows[0]

            const getPreviousMergeMortgageData = `
            SELECT 
          
            mort."bankName", mort.duration, mort."installmentFreq", mort.rate, mort."installmentAmount",
            mort."firstPaymentDate", mort."lastPaymentDate", mort."isFractioned", mort."agreedValue", mort."remainingValue"-- rate residue? (da calcolare? SI)
                       
            FROM "PropertyUnits" pu
            LEFT JOIN "Mortgages" mort ON mort."mortgageID" = pu."mortgageID"
            WHERE pu."propertyUnitID" = ${oldMerge}
            `
            const mortageData = (await pool.query(getPreviousMergeMortgageData)).rows[0]

            result.mortgage = mortageData

            res.json({
                requestType: "PUT",
                endpoint: `/propunit/${oldMerge}`,
                parentsID: propertyUnitIDs,
                PU:result
            })

        }
    } else {
        res.status(400)
        res.send("cannot perform a merge if a property unit is associated to one or more campaigns")
    }
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}

/**
 * Split a property unit previoulsy merged into the same PUs that formed it.
 * pipeline:
 * - set the parent PU to obsolete 
 * - set children PUs to not obsolete
 * - register merge relation in the db
 */

Propunit.split.post = async (req, res) => {
    try {
        const {
            propertyUnitID
        } = req.body
        const pool = await poolPromise

        const checkCampaigns = `
        SELECT DISTINCT cpu."campaignID"
        FROM "public"."PropertyUnits" pu 
        LEFT JOIN "public"."CampaignPropertyUnits" cpu ON cpu."propertyUnitID" = pu."propertyUnitID"
        WHERE pu."propertyUnitID" = '${propertyUnitID}'
        `
    
        const campaigns = (await pool.query(checkCampaigns)).rows
        const campaignList = []
        campaigns.forEach(element => {
            campaignList.push(element.campaignID)
        })

        if (campaignList.length === 0 || campaignList.some(element => element === null)){

        // get id of PU used to do the merge

        const getChildrenID = `
        SELECT puo."parentPUs"
        FROM "public"."PropertyUnits" pu 
        LEFT JOIN "public"."PropertyUnitsOperations" puo ON puo."propertyUnitID" = pu."propertyUnitID"
        WHERE pu."propertyUnitID" = '${propertyUnitID}' AND pu."isObsolete" = false AND puo."operationType" = 'merge'
        `

        const childrenIDs = await pool.query(getChildrenID)
        const childrenIDsArray = childrenIDs.rows[0].parentPUs

        // check if childrenIDs were already used in a split before for the input PU, if so do not register the split again

        // const checkPreviousSplit = `
        // SELECT puo."propertyUnitID"
        // FROM "PropertyUnitsOperations" puo
        // WHERE ARRAY [${propertyUnitID}]::int[] = "parentPUs"
        // `
        // const previousSplit = (await pool.query(checkPreviousSplit)).rows
        // const previousSplitArray = []
        // previousSplit.forEach(element => {
        //     previousSplitArray.push(element.propertyUnitID)
        // })

     //   if (previousSplitArray.length === 0) {
            const registerSplit = `
            -- insert the child PU and parent PUs and save the operation type
            ${childrenIDsArray ? childrenIDsArray.map((element) =>`
            INSERT INTO public."PropertyUnitsOperations" ("propertyUnitID", "parentPUs", "operationType", "creationDate") 
            VALUES('${element}',ARRAY [${propertyUnitID}],'split', '${update.toISOString()}');
            `).join('') : ''}
            `
            await pool.query(registerSplit)
      //  }

        const doSplit = `
        DO $$
            BEGIN

            -- set parent PU to obsolete
            UPDATE public."PropertyUnits" SET "isObsolete" = TRUE WHERE "propertyUnitID" = ${propertyUnitID};

            -- set the children PUs to not obsolete
            UPDATE public."PropertyUnits" SET "isObsolete" = FALSE WHERE "propertyUnitID" IN (${childrenIDsArray});

            END $$;
        `

        const split = await pool.query(doSplit)

        res.json(split)
        } else {
            res.status(400)
            res.send("cannot perform a split if a property unit is associated to one or more campaigns")
        }
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}



module.exports = Propunit