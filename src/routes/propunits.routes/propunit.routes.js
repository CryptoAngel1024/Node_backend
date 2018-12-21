const {
    Router
} = require('express')

const Propunit = require('../../api/propunits/propunits')

const router = new Router()

router.get('/', Propunit.get)
router.get('/:propertyUnitID', Propunit.id.get)

router.post('/', Propunit.post)
router.post('/merge', Propunit.merge.post)
router.post('/split', Propunit.split.post)

router.delete('/:propertyUnitID', Propunit.id.delete)

router.put('/:propertyUnitID', Propunit.id.put)


module.exports = router