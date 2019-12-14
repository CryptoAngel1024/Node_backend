const {
    Router
} = require('express')

const Campaign = require('../../api/campaigns/campaigns')

const router = new Router()

router.get('/', Campaign.get)
router.post('/', Campaign.post)
router.delete('/:campaignID', Campaign.id.delete)


module.exports = router