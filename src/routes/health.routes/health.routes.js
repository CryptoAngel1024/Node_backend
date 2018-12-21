const {
    Router
} = require('express')

const Health = require('../../api/health/health')

const router = new Router()

router.get('/', Health.get)

module.exports = router