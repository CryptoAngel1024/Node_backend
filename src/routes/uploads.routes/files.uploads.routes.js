const {
    Router
} = require('express')
const path = require('path')
const multer = require('multer')
const fs = require('fs');
const files = require('../../api/file_upload/files_upload')

const router = new Router()

/**
 * Upload file class
 * Required data from req.body:
 * - id 
 * - type
 * - fileType (photo or blueprint)
 * - path of files to be uploaded
 * 
 * NB: make sure that id and type are listed BEFORE the files in the req body
 */

const storage = multer.diskStorage({
    destination(req, file, cb) {
        // eslint-disable-next-line default-case
        switch (req.body.type) {
            case "Client":
                // eslint-disable-next-line no-case-declarations
                const dir = `./uploads/clients/${req.body.id}`
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir); // create new directory and write to it.
                }
                cb(null, path.join(__dirname, `../../../${dir}`));
                break
            case "Contract":
                // eslint-disable-next-line no-case-declarations
                const dir2 = `./uploads/contracts/${req.body.id}`
                if (!fs.existsSync(dir2)) {
                    fs.mkdirSync(dir2); // create new directory and write to it.
                }
                cb(null, path.join(__dirname, `../../../${dir2}`));
                break
            case "Proposal":
                // eslint-disable-next-line no-case-declarations
                const dir3 = `./uploads/proposals/${req.body.id}`
                if (!fs.existsSync(dir3)) {
                    fs.mkdirSync(dir3); // create new directory and write to it.
                }
                cb(null, path.join(__dirname, `../../../${dir3}`));
                break
            case "PropUnit":
                // eslint-disable-next-line no-case-declarations
                const dir4 = `./uploads/propunits/${req.body.id}`
                if (!fs.existsSync(dir4)) {
                    fs.mkdirSync(dir4); // create new directory and write to it.
                }
                // eslint-disable-next-line no-case-declarations
                let dir4Files
                if (req.body.fileType === "photo") {
                    dir4Files = `${dir4}/photos`
                } else if (req.body.fileType === "blueprint") {
                    dir4Files = `${dir4}/blueprints`
                }
                if (!fs.existsSync(dir4Files)) {
                    fs.mkdirSync(dir4Files); // create new directory and write to it.
                }
                cb(null, path.join(__dirname, `../../../${dir4Files}`));
                break
            case "Building":
                // eslint-disable-next-line no-case-declarations
                const dir5 = `./uploads/buildings/${req.body.id}`
                if (!fs.existsSync(dir5)) {
                    fs.mkdirSync(dir5); // create new directory and write to it.
                }
                cb(null, path.join(__dirname, `../../../${dir5}`));
                break
            case "Presale":
                // eslint-disable-next-line no-case-declarations
                const dir6 = `./uploads/presales/${req.body.id}`
                if (!fs.existsSync(dir6)) {
                    fs.mkdirSync(dir6); // create new directory and write to it.
                }
                cb(null, path.join(__dirname, `../../../${dir6}`));
                break
        }

    },
    filename(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
})

const upload = multer({
    storage
})

router.post('/', upload.array('files', 10), files.post)

module.exports = router