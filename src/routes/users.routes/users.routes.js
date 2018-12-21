const {
    Router
} = require('express')

const User = require('../../api/users/users')

const router = new Router()

router.get('/', User.get)
router.get('/roles', User.roles.get)

router.post('/', User.post)
router.post('/:userID/passwordreset', User.id.passwordReset.post)
router.post('/login', User.login.post)

router.get('/:userID', User.id.get)
router.put('/:userID', User.id.put)
router.put('/:userID/password', User.id.password.put)

router.delete('/:userID', User.id.delete)




module.exports = router