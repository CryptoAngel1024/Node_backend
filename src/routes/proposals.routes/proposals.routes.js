const {
    Router
} = require('express')

const Proposal = require('../../api/proposals/proposals')

const router = new Router()

// router.get('/', Proposal.get)
// router.post('/', Proposal.post)
// router.get('/:id', Proposal.id.get)
// router.delete('/:id', Proposal.id.delete)
// router.put('/:id', Proposal.id.put) // add validator (?)

module.exports = router