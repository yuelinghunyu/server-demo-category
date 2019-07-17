const Koa = require('koa')
const app = new Koa()
const koaStatic = require("koa-static")
const koaBody = require('koa-body')
const mongoose = require("mongoose")
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const routing = require('./router')
const { connectionStr } = require("./config")
const path = require("path")

mongoose.connect(connectionStr, { useNewUrlParser: true }, () => {console.log("MongoDB 连接成功了")})
mongoose.connection.on("error", console.error)

app.use(koaStatic(path.join(__dirname, "public")))
app.use(error({
   postFormat: (e, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
}))
app.use(koaBody({
   multipart: true,
   formidable: {
      uploadDir: path.join(__dirname, "/public/uploads"),
      keepExtensions: true
   }
}))
app.use(parameter(app)) // 校验请求题
routing(app)
app.listen(3000, () => console.log('程序启动成功，端口: 3000'))