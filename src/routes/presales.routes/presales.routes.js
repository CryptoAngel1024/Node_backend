const {
    Router
} = require('express')

const Presale = require('../../api/presales/presales')

const router = new Router()

// router.get('/', Presale.get)
// router.post('/', Presale.post)
// router.get('/:id', Presale.id.get)
// router.delete('/:id', Presale.id.delete)
// router.put('/:id', Presale.id.put) // add validator (?)

module.exports = router