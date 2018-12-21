const {
    Router
} = require('express')

const Address = require('../../api/dropdowns/addresses')

const router = new Router()

router.get('/:buildingID', Address.get)

module.exports = router