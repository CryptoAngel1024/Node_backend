const {
    Router
} = require('express')

const Role = require('../../api/dropdowns/roles')

const router = new Router()

router.get('/', Role.get)

module.exports = router