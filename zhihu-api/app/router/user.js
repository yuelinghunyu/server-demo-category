const Router = require("koa-router")
const router = new Router({ prefix: '/users' })

const { create, find, findById, update, delete: del } = require("../controller/user")

router.get('/', find)
router.post('/', create)
router.get('/:id', findById)
router.patch('/:id', update)
router.delete('/:id', del)

module.exports = router