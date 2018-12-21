const {
    Router
} = require('express')

const Type = require('../../api/dropdowns/types')

const router = new Router()

router.get('/', Type.get)

module.exports = router