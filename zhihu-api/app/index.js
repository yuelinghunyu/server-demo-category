const Koa = require('koa')
const app = new Koa()
const bodyparser = require('koa-bodyparser')
const mongoose = require("mongoose")
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const routing = require('./router')
const { connectionStr } = require("./config")

mongoose.connect(connectionStr, { useNewUrlParser: true }, () => {console.log("MongoDB 连接成功了")})
mongoose.connection.on("error", console.error)

app.use(error({
   postFormat: (e, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
}))
app.use(bodyparser())
app.use(parameter(app)) // 校验请求题
routing(app)
app.listen(3000, () => console.log('程序启动成功，端口: 3000'))