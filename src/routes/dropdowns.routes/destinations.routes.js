const {
    Router
} = require('express')

const Role = require('../../api/dropdowns/destinations')

const router = new Router()

router.get('/', Role.get)

module.exports = router