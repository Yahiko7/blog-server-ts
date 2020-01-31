const authenticateList = [
  '/user/loginAdmin',
]

const sessionCheck = function(app){
  app.use(async function(ctx,next){
    if(authenticateList.indexOf(ctx.path) === -1){
      if (!ctx.session.userInfo) {
        ctx.throw(401,'您还没登录,或者登录信息已过期，请重新登录！')
        return;
      }
    }
    await next();
  })

}

export default sessionCheck