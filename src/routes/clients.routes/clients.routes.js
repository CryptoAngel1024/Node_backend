const {
    Router
} = require('express')

const Client = require('../../api/clients/clients')

const router = new Router()

// router.get('/', Client.get)
// router.post('/', Client.post)
// router.get('/:id', Client.id.get)
// router.delete('/:id', Client.id.delete)
// router.put('/:id', Client.id.put) // add validator (?)

module.exports = router