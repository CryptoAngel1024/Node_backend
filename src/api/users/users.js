const crypto = require('crypto')
const {
    poolPromise
} = require('../../database/connect')
const {
    encrypt,
    decrypt
} = require('../../utilities/encrypt')

const {
    generatePassword
} = require('../../utilities/password-generator')

const User = {
    id: {
        password: {},
        passwordReset: {}
    },
    login: {},
    roles: {}
}
const ENCRYPT_SALT_BYTES = 16

// Create a new user
User.post = async (req, res) => {
    try {
        const {
            name, 
            surname,
            company,
            email,
            photoUrl,
            role
        } = req.body
        const password = "c@lt@g1r0n3"
        // generate a random 32 bytes salt
        const saltHex = crypto.randomBytes(ENCRYPT_SALT_BYTES).toString('hex')
        const salt = Buffer.from(saltHex, 'hex')
        const secretString = process.env.PSW_SECRET
        const secret = Buffer.from(secretString, 'hex')
        // encrypt random password with salt and secret
        const encryptedRanPass = await encrypt(password, { salt, secret})
        const values = [encryptedRanPass, role, saltHex, name, surname, company, email, true, photoUrl]
        const text = `INSERT INTO public."Users" (password, role, salt, name, surname, company, email, status) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING "userID"`
        const pool = await poolPromise
        const result = await pool.query(text, values)
        res.json(result.rows[0])
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}


// get a specific user
User.id.get = async (req, res) => {
    const pool = await poolPromise
    try {
        const {
            userID
        } = req.params
        const text = `SELECT "userID", "name", "surname", "company", "email", "telephone", "cellphone", "role", "status", "photoUrl" FROM public."Users" WHERE "userID" = ($1)`
        const userRetrieved = await pool.query(text, [userID])
        if (userRetrieved.rows.length)
            res.json(userRetrieved.rows)
        else {
            res.status(404)
            res.end(`Not Found, user with userID ${userID} does not exist.`)
        }
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}

// Get all the users
User.get = async (req, res) => {
    try {
        const text = `SELECT "userID", "name", "surname", "role", "status", "email", "photoUrl" FROM public."Users"`
        const pool = await poolPromise
        const result = await pool.query(text)
        res.json(result.rows)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}


// Edit a user role
User.id.put = async (req, res) => {
    try {
        const {
            userID
        } = req.params
        const {
            role,
            name,
            surname,
            email,
            company,
            telephone,
            cellphone,
            photoUrl,
            status
        } = req.body
        // check if only one field was sent
        const keys = Object.keys(req.body)
        const isOnlyStatus = keys.length === 1 && (status === false || status === true)
        // if not only status is to be updated, validate other fields
        if (!isOnlyStatus) {
            const inputValidation = role.length && name.length && surname.length && email.length && company.length && telephone.length && cellphone.length && photoUrl.length &&
                (status === false || status === true)
            if (!inputValidation) {
                res.status(400)
                return res.end()
            } 
        }
        const values =  isOnlyStatus ? [status] : [role, name, surname, email, company, telephone, cellphone, status, photoUrl]
        const textStatus = `UPDATE public."Users" SET status = ($1) WHERE "userID" = ${userID}`
        const text = `UPDATE public."Users" SET role = ($1), "name" = ($2), "surname" = ($3), "email" = ($4), "company" = ($5), "telephone" = ($6), "cellphone" = ($7), status = ($8), "photoUrl" = ($9) WHERE "userID" = ${userID}`
        const finalText = isOnlyStatus ? textStatus : text
        const pool = await poolPromise
        await pool.query(finalText, values)
        res.status(204)
        res.end()
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}

// Update password
User.id.password.put = async (req, res) => {
    try {
        const {
            userID
        } = req.params
        const {
            currentPassword,
            newPassword
        } = req.body

        const pool = await poolPromise
        // get current encrypted password 
        const retrieveCurrentPassword = await pool.query(`SELECT "password", "salt" FROM public."Users" WHERE "userID" = ${userID}`)
        const currentPasswordRetrieved = retrieveCurrentPassword.rows[0].password
        const currentPasswordSalt = retrieveCurrentPassword.rows[0].salt
        const secretStr = process.env.PSW_SECRET
        const salt =  Buffer.from(currentPasswordSalt, 'hex')
        const secret =  Buffer.from(secretStr, 'hex')
        const decryptOptions = {
            salt,
            secret
        }
        // decrypt current password
        if (await decrypt(currentPasswordRetrieved, currentPassword, decryptOptions)) {
            // generate new salt for the user
            const newSaltHex = crypto.randomBytes(ENCRYPT_SALT_BYTES).toString('hex')
            const newSalt = Buffer.from(newSaltHex, 'hex')
            const encryptedPassword = await encrypt(newPassword, {salt: newSalt, secret})
            const values = [encryptedPassword, newSaltHex]
            const text = `UPDATE public."Users" SET password = ($1), salt = ($2) WHERE "userID" = ${userID}`
            const result = await pool.query(text, values)
            res.json(result)
        } else {
            res.send(403, "Inserted password is incorrect, please try again")
        }

    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}



// Delete a specific user
User.id.delete = async (req, res) => {
    try {
        const {
            userID
        } = req.params
        const text = `DELETE FROM public."Users" WHERE "userID" = ${userID}`
        const pool = await poolPromise
        const result = await pool
            .query(text)
        res.json(result)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}

// Reset a user newPassword
User.id.passwordReset.post = async (req, res) => {
    try {
        const {
            userID
        } = req.params

        // generate a random 32 bytes salt
        const saltHex = crypto.randomBytes(ENCRYPT_SALT_BYTES).toString('hex')
        const salt = Buffer.from(saltHex, 'hex')
        const randomPassword = generatePassword(6)
        const secretString = process.env.PSW_SECRET
        const secret = Buffer.from(secretString, 'hex')
        // encrypt random password with salt and secret
        const encryptedRanPass = await encrypt(randomPassword, { salt, secret})
        const values = [encryptedRanPass, saltHex]
        const text = `UPDATE public."Users" SET password = ($1), salt = ($2) WHERE "userID" = ${userID}`
        const pool = await poolPromise
        await pool.query(text, values)
        res.json({
            newPassword: randomPassword
        })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}

// login function 
User.login.post = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body
        const pool = await poolPromise

        // Check if user exists
        const checkUsername = await pool.query(`SELECT exists(SELECT  1 FROM public."Users" WHERE "email" = '${email}');`)
        const retrievedEmail = checkUsername.rows[0].exists

        if (retrievedEmail === true) {
            const retrievedUser = await pool.query(`SELECT "userID", "email", "password", "salt", "role", "status", "photoUrl" FROM public."Users" WHERE "email" = '${email}'`)
            const passwordRetrieved = retrievedUser.rows[0].password
            const emailRetrieved = retrievedUser.rows[0].email

            const userSaltRetrieved = retrievedUser.rows[0].salt
            const userStatus = retrievedUser.rows[0].status
            const secretString = process.env.PSW_SECRET
            const secret = Buffer.from(secretString, 'hex')
            const salt = Buffer.from(userSaltRetrieved, 'hex')
            const decryptOptions = {
                salt,
                secret
            }
            if (await decrypt(passwordRetrieved, password, decryptOptions) && email === emailRetrieved) {
                // verify the user is active or not
                if (userStatus === false) {
                    res.status(403)
                    res.send("Forbidden, insufficient permission")
                } else {
                    res.json({ "userID": retrievedUser.rows[0].userID, "role": retrievedUser.rows[0].role, "photoUrl": retrievedUser.rows[0].photoUrl})
                }
            } else {
                res.status(401)
                res.send("Incorrect Username and/or Password!")
            }
        } else if (email.length === 0 || password.length === 0) {
            res.status(500)
            res.send("Username or Password fields are missing!")
        } else {
            res.status(401)
            res.send("Incorrect Username and/or Password!")
        }
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}


// get function for avaiable roles
User.roles.get = async (req, res) => {
    try {
        res.json([{
            id: 1,
            role: "ClientManagement"
        },
        {
            id: 2,
            role: "Sales"
        },
        {
            id: 3,
            role: "SalesPro"
        },
        {
            id: 4,
            role: "Committee"
        },
        {
            id: 5,
            role: "Chief"
        },
        {
            id: 6,
            role: "ContractManagement"
        },
        {
            id: 7,
            role: "SellManagament"
        },
        {
            id: 8,
            role: "Treasury"
        },
        {
            id: 9,
            role: "Admin"
        }
        ])
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}


module.exports = User