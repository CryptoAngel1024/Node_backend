const {
    Router
} = require('express')

const Contract = require('../../api/contracts/contracts')

const router = new Router()

// router.get('/', Contract.get)
// router.post('/', Contract.post)
// router.get('/:id', Contract.id.get)
// router.delete('/:id', Contract.id.delete)
// router.put('/:id', Contract.id.put) // add validator (?)

module.exports = router