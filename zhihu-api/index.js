const Koa = require('koa')
const app = new Koa()

app.use(async (ctx, next) => {
 if(ctx.url === '/') {
    ctx.body = '这是用户主页'
 } else if(ctx.url === '/user') {
    ctx.body = '这是用户列表页'
 } else {
    ctx.status = 400
 }
})
app.listen(3000)