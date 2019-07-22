const jwt = require('koa-jwt')
const Router = require("koa-router")
const router = new Router({ prefix: '/users' })

const { 
  create, find, findById, update, delete: del, login, checkOwner, checkUserExist, listFollowing, follow, unFollow, listFollowers
} = require("../controller/user")
const { secret } = require("../config")

// const auth = async (ctx, next) => {
//   const { authorization = "" } = ctx.request.header
//   const token = authorization.replace('Bearer ', '')
//   try {
//     const user = jsonwebtoken.verify(token, secret)
//     ctx.state.user = user // 约定的规范
//   } catch (error) {
//     ctx.throw(401, error.message)
//   }
//   await next()
// }
const auth = jwt({ secret })

router.get('/', find)
router.post('/', create)
router.get('/:id', findById)
router.patch('/:id', auth, checkOwner, update)
router.delete('/:id', auth, del)
router.post('/login', login)
router.get("/:id/following", listFollowing)
router.post('/following/:id', auth, checkUserExist, follow)
router.delete('/following/:id', auth, checkUserExist, unFollow)
router.get("/:id/followers", listFollowers)

module.exports = router