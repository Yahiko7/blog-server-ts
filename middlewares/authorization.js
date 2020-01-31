const authenticateList = [
  '/user/loginAdmin',
]

const authenticate = async function(app){

  app.use(async function(ctx,next){
    // 设置接口白名单，不进行token验证
    if (authenticateList.indexOf(ctx.url) !== -1) {
      await next()
    } else {
      try {
        let token = ctx.header.authorization  // 获取请求携带的token
        if (token) {
          let payload
          try {
            payload = await verify(token.split(' ')[1].replace(/\s/g,''), secret.sign)  // 解密payload，获取用户名和ID
            // 验证 合法性
            // if (payload.exp <= new Date()/1000) {
            //   console.log('过期了')
            // }
            await next()
          } catch (err) {
            ctx.body = {success: true, message: '登录密钥失效或过期，请重新登录', code: -1}
            console.log('token verify fail: ', err)
          }
        } else {
          ctx.body = {success: false, message: '验证失败', code: -1}
        }
      } catch (err) {
        console.log(err)
      }
    }
  })
}

export default authenticate