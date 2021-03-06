const jsonwebtoken = require('jsonwebtoken')
const User = require("../model/users")
const { secret } = require("../config")
class UsersCtl {
  async find(ctx) {
    ctx.body = await User.find()
  }
  async findById(ctx) {
    const { fields } = ctx.query
    console.log(fields)
    const selectFields = fields&&Object.keys(fields).length && fields.split(";").filter(f => f).map(f => "+" + f).join("")
    console.log(selectFields)
    const user = await User.findById(ctx.params.id).select(selectFields)
    // const user = await User.findById(ctx.params.id).select("+gender+employments")
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
      password: { type: 'string', require: false },
      avatar_url: { type: 'string', require: false },
      gender: { type: 'string', require: false },
      headline: { type: 'string', require: false },
      locations: { type: 'array', itemType: 'string', require: false },
      business: { type: 'string', require: false },
      employments: { type: 'array', itemType: 'object', require: false },
      educations: { type: 'array', itemType: 'object', require: false }
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

  async listFollowing(ctx) {
    const user = await User.findById(ctx.params.id).select('+following').populate('following')
    if(!user) { ctx.throw(404) }
    ctx.body = user.following
  }
 
  async checkUserExist(ctx, next) {
    const user = await user.findById(ctx.params.id)
    if(!user) { ctx.throw(404, '用户不存在') }
    await next()
  }

  async follow(ctx) {
    const me = await User.findById(ctx.state.user._id).select("+following")
    if(!me.following.map(id => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
  }

  async unFollow(ctx) {
    const me = await User.findById(ctx.state.user._id).select("+following")
    const index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
    if(index > -1) {
      me.following.splice(index, 1)
      me.save()
    }
    ctx.status = 204
  }

  async listFollowers (ctx) {
    const users = await User.find({following: ctx.params.id})
    ctx.body = users
  }
}

module.exports = new UsersCtl()