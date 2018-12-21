/* eslint-disable no-case-declarations */
/* eslint-disable default-case */
const FilesUpload = {}

FilesUpload.post = async (req, res) => {
    // fetch the destinations path of the uploaded files
    const uploadedFiles = []
    req.files.forEach(element => {
        const firstPart = "/uploads/"
        switch (req.body.type) {
            case "Client":
                const client = `clients/${  req.body.id  }/`
                const clientUrl = firstPart + client + element.filename
                uploadedFiles.push(clientUrl)
                break
            case "Contract":
                const contract = `contracts/${  req.body.id  }/`
                const contractUrl = firstPart + contract + element.filename
                uploadedFiles.push(contractUrl)
                break
            case "Proposal":
                const proposal = `proposals/${  req.body.id  }/`
                const proposalUrl = firstPart + proposal + element.filename
                uploadedFiles.push(proposalUrl)
                break
            case "PropUnit":
                let propunit = `propunits/${  req.body.id  }/`
                if (req.body.fileType === "photo") {
                    propunit = `${propunit}photos/`
                } else if (req.body.fileType === "blueprint") {
                    propunit = `${propunit}blueprints/`
                }
                const propunitUrl = firstPart + propunit + element.filename
                uploadedFiles.push(propunitUrl)
                break
            case "Building":
                const building = `buidings/${  req.body.id  }/`
                const buildingUrl = firstPart + building + element.filename
                uploadedFiles.push(buildingUrl)
                break
            case "Presale":
                const presale = `presales/${  req.body.id  }/`
                const presaleUrl = firstPart + presale + element.filename
                uploadedFiles.push(presaleUrl)
                break
        }
    });

    res.json({
        msg: 'Files successfully uploaded',
        files: uploadedFiles
    })

}
module.exports = FilesUpload