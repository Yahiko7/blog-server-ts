### koa 项目搭建： 
```
koa 脚手架
npm install koa-generator -g
koa2 my-project
cd my-project
npm installgit 代码仓库
```
koa项目依赖：
koa-views  //模版渲染 
koa-statics  // 静态资源文件


### 引入babel
如何快速进行babel？
开发环境下通过babel-node
1、安装babel-cli 和 babel-preset-env（<babel7.0）

2、.babelrc文件
```
{
  "presets": [
    [
      "env",
      {
        "target":{
          "node": "current"
        }
      }
    ]
  ]
}
```
babel编译js文件
```
babel-node src/index.js --presets env
```
开发环境下实时监听node文件改动，自动重启：nodemon

实时编译es6写法

```
./node_modules/.bin/nodemon bin/www.js --exec babel-node --presets env bin/www.js
// --exec 替代当前的进程 
```
### 静态资源强制缓存
```
// koa-static 配置
app.use(require('koa-static')(config.staticDir,{
  maxage: 24 * 60 * 60
}))
```

### 错误处理
404错误处理
```
app.use(async function pageNotFound(ctx,next) {
  // we need to explicitly set 404 here
  // so that koa doesn't assign 200 on body=
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
```
500错误页面
```
app.use(async (ctx, next) => {
  try {
    await next()
    if (ctx.status === 404) ctx.throw(404)
  } catch (err) {
    console.error(err)
    ctx.status = err.status || 500
    ctx.body = errorPug({
      title: '服务器维护中',
      message: err.message,
      error:{
        status: 500,
        stack: err.stack
      }
    })
  }
})
```

koa-onerror处理500页面	
```
onerror(app,{
  accepts() {
    return 'html';
  },
  html(err, ctx) {
    ctx.body = errorPug({
      title: '服务器维护中',
      message: err.message,
      error:{
        status: 500,
        stack: err.stack
      }
    })
  }
})
```
### 日志记录
pm2方式
```
console.log -> pm2 -> pm2-logrotate 切割
```
log4js，比较标准化
```
const log4js = require('log4js');

//配置
log4js.configure({
  appenders: { cheese: { type: 'file', filename: path.resolve(__dirname,'../log/error.log')} },
  categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger('cheese');

//打印
logger.error('aaaa')

```

### 模版引擎 
注意模版引擎要开启script标签转译，防止xss
```
koa-swig autoescape设置为true
app.context.render = render({
  root: path.join(__dirname, 'views'),
  autoescape: true,
  cache: 'memory', // disable, set to false
  ext: 'html',
  locals: locals,
  filters: filters,
  tags: tags,
  extensions: extensions
});
```
如何使用的是koa-views，它已经自动转义了

### koa洋葱模型
```
// #1
app.use(async (ctx, next)=>{
    console.log(1)
    await next();
    console.log(1)
});
// #2
app.use(async (ctx, next) => {
    console.log(2)
    await next();
    console.log(2)
})

app.use(async (ctx, next) => {
    console.log(3)
})
```



控制台打印:
```
1
2
3
2
1
```


koa-swig 编写：
```
import render from "koa-swig";
import { wrap } from 'co';

app.context.render = wrap(render({
    root: viewDir,
    autoescape: true, //注意这个配置项目
    cache: false,
    ext: 'html',
    writeBody: false
}));
```

### koa 处理转发
使用http-proxy-middleware中间件
```
//转发
const Router = require('koa-router');
const k2c = require('koa2-connect');
const proxy = require('http-proxy-middleware');
const router = new Router()
router.post('/yii-basic/web/index.php', 
  k2c(
    proxy({
      target: 'http://localhost/',
      // target: 'https://api.github.com/',
      changeOrigin:true
    })
  )
)
app.use(router.routes())
```


### 架构 —— IOC

- 使用awilix和awilix-koa进行依赖注入
- 使用@babel/plugin-proposal-decorators打包装饰器写法

相关文档：
awilix-router-core： https://github.com/jeffijoe/awilix-router-core

### 性能优化


### 项目优化

抽离runtimejs,放在公共的头部layout


### 性能监控


### 错误监控

问题：
koa 如何用js对象方法操作sql？
koa 如何处理转发?

参考模版：

react hooks + koa2 + sequelize + mysql ：https://github.com/gershonv/react-blog

基于 node + express + mongodb 的博客网站后台 ：https://github.com/biaochenxuying/blog-node

github开源实战项目：https://segmentfault.com/a/1190000019488576


### 异常统一处理



#### CSRF漏洞处理

解决：
1、http-only 防止cookie被窃取
2、在header中设置token

https://www.jianshu.com/p/67408d73c66d
https://blog.csdn.net/xiaoxinshuaiga/article/details/80766369
https://www.cnblogs.com/sablier/p/11099909.html
https://juejin.im/post/5bc009996fb9a05d0a055192

### 用户登录状态

session + cookie + redis

参考：
https://www.cnblogs.com/cangqinglang/p/10266952.html
https://juejin.im/post/5d5def966fb9a06b2d77d8ec

注意：服务端设置cookie，前端ajax请求的适合需要设置 withCredentials: true

koa-session： 

#### JWT Token 处理

JWT token 介绍：http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html


常规用户身份认证流程：

1、用户向服务器发送用户名和密码。

2、服务器验证通过后，在当前对话（session）里面保存相关数据，比如用户角色、登录时间等等。

3、服务器向用户返回一个 session_id，写入用户的 Cookie。

4、用户随后的每一次请求，都会通过 Cookie，将 session_id 传回服务器。

5、服务器收到 session_id，找到前期保存的数据，由此得知用户的身份。

session_id 包含的相关用户信息存储在redies

token 认证流程：
1、客户端通过用户名密码登陆

2、服务器验证用户名密码，若通过，生成token返回客户端

3、客户端收到token后每次请求时携带该token（相当于一个令牌，表示我有权限访问）

4、服务器接收token，验证该token的合法性，若通过验证，则通过请求，反之，返回请求失败。

JWT Token 参考：
https://github.com/Yxliam/vue-koa2-token
https://juejin.im/post/5d81d3bf6fb9a06b05182429
https://www.cnblogs.com/pomelott/p/11026626.html

**token过期如何处理？**


**JWT Token 弊端**

1、HS256 加密过后的字符串过长，每次请求都带上，会增加带宽


### 跨域解决

使用 koa-cors 解决

参考：
https://juejin.im/post/5ce667d8f265da1b7f29572e
https://blog.csdn.net/lihefei_coder/article/details/95205095


### 依赖注入 + typescrip

- 依赖注入框架 inversify 
- inversify koa 封装版本 inversify-koa-utils
- 在inversify 用装饰器绑定依赖关系 inversify-binding-decorators




