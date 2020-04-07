export default {
  error404(app,logger){
    app.use(async function pageNotFound(ctx,next) {
      await next();
      if(ctx.status ===  404){
        switch (ctx.accepts('html', 'json')) {
          case 'html':
            ctx.type = 'html';
            ctx.body = '<p>Page Not Found</p>';
            break;
          case 'json':
            ctx.body = {
              message: 'Page Not Found'
            };
            break;
          default:
            ctx.type = 'text';
            ctx.body = 'Page Not Found';
        }
      }
    });
  },
  error500(app,logger){

    //手写500错误页面
    app.use(async (ctx, next) => {
      
      try {
        await next()
        // if (ctx.status === 404) ctx.throw(404)
      } catch (err) {
        
        ctx.status = err.statusCode || err.status || 500
        if(ctx.status !== 500){
          ctx.body = {
            code: ctx.status,
            data: err
          }
        }else{
          console.log(err)
          logger.error(err)
          ctx.body = {
            code: 500,
            msg: '服务器维护中'
          }
        }
        
      }
    })
  }
}

