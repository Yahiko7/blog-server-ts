import cors from 'koa2-cors'
const ALLOW_ORIGIN = [ // 域名白名单
  'localhost',
  'hookyun'
];

// 判断origin是否在域名白名单列表中
function isOriginAllowed(origin) {  
  console.log(origin)
  for(let i = 0; i < ALLOW_ORIGIN.length; i++){
    if(origin.indexOf(ALLOW_ORIGIN[i]) !== -1){
      return true
    }
  }
  return false
}
   

const CorsHandler = function (app) {
  // app.use(cors({
  //   origin: function (ctx) {
  //     let host = ctx.host.split(":")[0]
  //     if (whiteOrigin.indexOf(ctx.origin) !== -1) {
  //       return "*"; // 允许来自所有域名请求
  //     }
  //   },
  //   exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  //   maxAge: 5,
  //   credentials: true,
  //   allowMethods: ['OPTIONS','GET', 'POST', 'PUT','DELETE'],
  //   allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
  // }))
  app.use(async (ctx, next) => {
      // 允许来自所有域名请求
      if (ctx.header.origin && isOriginAllowed(ctx.header.origin)) {

        ctx.set("Access-Control-Allow-Origin", ctx.header.origin);
    
        // 设置所允许的HTTP请求方法
        ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
    
        // 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段.
        ctx.set("Access-Control-Allow-Headers", "*");
    
        // 服务器收到请求以后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，就可以做出回应。
    
        // Content-Type表示具体请求中的媒体类型信息
        ctx.set("Content-Type", "application/json;charset=utf-8");
    
        // 该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。
        // 当设置成允许请求携带cookie时，需要保证"Access-Control-Allow-Origin"是服务器有的域名，而不能是"*";
        ctx.set("Access-Control-Allow-Credentials", true);
    
        // 该字段可选，用来指定本次预检请求的有效期，单位为秒。
        // 当请求方法是PUT或DELETE等特殊方法或者Content-Type字段的类型是application/json时，服务器会提前发送一次请求进行验证
        // 下面的的设置只本次验证的有效时间，即在该时间段内服务端可以不用进行验证
        // ctx.set("Access-Control-Max-Age", 300);
    
        /*
        CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：
            Cache-Control、
            Content-Language、
            Content-Type、
            Expires、
            Last-Modified、
            Pragma。
        */
        // 需要获取其他字段时，使用Access-Control-Expose-Headers，
        // getResponseHeader('myData')可以返回我们所需的值
        // ctx.set("Access-Control-Expose-Headers", "myData");
      }
      
  
      await next();
  })

}

export default CorsHandler 