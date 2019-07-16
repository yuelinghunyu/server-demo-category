const jsonwebtoken = require('jsonwebtoken')
const User = require("../model/users")
const { secret } = require("../config")
class UsersCtl {
  async find(ctx) {
    ctx.body = await User.find()
  }
  async findById(ctx) {
    const user = await User.findById(ctx.params.id)
    if(!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }
  async create(ctx) { //创建用户
    ctx.verifyParams({
      name: { type: 'string', require: true },
      password: { type: 'string', require: true }
    })
    const { name } = ctx.request.body
    const repeatedUser = await User.findOne({name})
    if(repeatedUser) {
      ctx.throw(409, '用户已经存在')
    }
    const user = await new User(ctx.request.body).save()
    ctx.body = user
  }
  async update(ctx) { // 更新用户
    ctx.verifyParams({
      name: { type: 'string', require: false },
      password: { type: 'string', require: false }
    })
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if(!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }
  async delete(ctx) { // 删除用户
    const user = await User.findByIdAndRemove(ctx.params.id)
    if(!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.status = 204
  }
  async login(ctx) {
    ctx.verifyParams({
      name: { type: 'string', require: true },
      password: { type: 'string', require: true }
    })
    const user = await User.findOne(ctx.request.body)
    if(!user) { ctx.throw(401, '用户名或者密码不存在') }
    const {_id, name} = user
    const token = jsonwebtoken.sign({_id, name}, secret, { expiresIn: '1d' })
    ctx.body = { token }
  }

  async checkOwner(ctx, next) {
    if(ctx.params.id !== ctx.state.user._id) { ctx.throw(403, '没有权限') }
    await next()
  }
}

module.exports = new UsersCtl()