import onerror from 'koa-onerror'
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
    // onerror(app,{
    //   accepts() {
    //     return 'html';
    //   },
    //   html(err, ctx) {
    //     logger.error(err)
    //     console.log(ctx.response)
    //     if(ctx.response.status !== 500){
    //       ctx.body =  {
    //         message: 'Page Not Found'
    //       };
    //     }else{
    //       ctx.body = {
    //         code: 0,
    //         message: '服务器维护中'
    //       }
    //     }
        
        
    //   }
    // })

    //手写500错误页面
    app.use(async (ctx, next) => {
      try {
        await next()
        if (ctx.status === 404) ctx.throw(404)
      } catch (err) {
        ctx.status = err.status || 500
        // ctx.body = errorPug({
        //   title: '服务器维护中',
        //   message: err.message,
        //   error:{
        //     status: 500,
        //     stack: err.stack
        //   }
        // })
        if(ctx.status !== 500){
          ctx.body = {
            code: 0,
            msg: err.message
          }
        }else{
          console.error(err)
          ctx.body = {
            code: 500,
            msg: '服务器维护中'
          }
        }
        
      }
    })
  }
}

