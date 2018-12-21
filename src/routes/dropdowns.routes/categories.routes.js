const {
    Router
} = require('express')

const Category = require('../../api/dropdowns/categories')

const router = new Router()

router.get('/', Category.get)

module.exports = router