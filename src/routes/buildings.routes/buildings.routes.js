const {
    Router
} = require('express')

const Building = require('../../api/buildings/buildings')

const router = new Router()

router.get('/', Building.get)
router.post('/', Building.post)
router.get('/:buildingID', Building.id.get)
// router.delete('/:id', Building.id.delete)
// router.put('/:id', Building.id.put) // add validator (?)

module.exports = router