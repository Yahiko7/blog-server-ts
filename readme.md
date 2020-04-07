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



通过cookie传递用户身份信息 认证流程：

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

inversify 手动绑定关系写法：

步骤1: 声明接口和类型
```javascript
// file interfaces.ts
export interface Warrior {
  fight(): string;
  sneak(): string;
}

export interface Weapon {
  hit(): string;
}

export interface ThrowableWeapon {
  throw(): string;
}
```

inversify需要使用type作为标识符,可以使用Symbol作为标识服

```javascript
// file types.ts

const TYPES = {
    Warrior: Symbol.for("Warrior"),
    Weapon: Symbol.for("Weapon"),
    ThrowableWeapon: Symbol.for("ThrowableWeapon")
};

export { TYPES };
```

步骤二：用 @injectable 和 @inject 装饰器 作为依赖

```javascript
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { Weapon, ThrowableWeapon, Warrior } from "./interfaces";
import { TYPES } from "./types";

@injectable()
class Katana implements Weapon {
  public hit() {
      return "cut!";
  }
}

@injectable()
class Shuriken implements ThrowableWeapon {
  public throw() {
      return "hit!";
  }
}

@injectable()
class Ninja implements Warrior {

  private _katana: Weapon;
  private _shuriken: ThrowableWeapon;

  public constructor(
    @inject(TYPES.Weapon) katana: Weapon,
    @inject(TYPES.ThrowableWeapon) shuriken: ThrowableWeapon
  ) {
      this._katana = katana;
      this._shuriken = shuriken;
  }

  public fight() { return this._katana.hit(); }
  public sneak() { return this._shuriken.throw(); }

}

export { Ninja, Katana, Shuriken };
```

还可以使用属性注入替代构造器注入

```javascript
@injectable()
class Ninja implements Warrior {
    @inject(TYPES.Weapon) private _katana: Weapon;
    @inject(TYPES.ThrowableWeapon) private _shuriken: ThrowableWeapon;
    public fight() { return this._katana.hit(); }
    public sneak() { return this._shuriken.throw(); }
}
```

步骤3:创建和配置一个容器

建议在一个单独的文件中 inversify.config.ts 创建容器，这是唯一存在耦合的地方。

```javascript
// file inversify.config.ts

import { Container } from "inversify";
import { TYPES } from "./types";
import { Warrior, Weapon, ThrowableWeapon } from "./interfaces";
import { Ninja, Katana, Shuriken } from "./entities";

const myContainer = new Container();
myContainer.bind<Warrior>(TYPES.Warrior).to(Ninja);
myContainer.bind<Weapon>(TYPES.Weapon).to(Katana);
myContainer.bind<ThrowableWeapon>(TYPES.ThrowableWeapon).to(Shuriken);

export { myContainer };
```


步骤四：解决依赖关系

通过上面的步骤，我们可以 Container 的 get<T> 方法来解析依赖，
解决文件与文件相互引用的耦合关系。

```javascript
import { myContainer } from "./inversify.config";
import { TYPES } from "./types";
import { Warrior } from "./interfaces";

const ninja = myContainer.get<Warrior>(TYPES.Warrior);

expect(ninja.fight()).eql("cut!"); // true
expect(ninja.sneak()).eql("hit!"); // true
```

inversify 详细文档请看：https://github.com/inversify/InversifyJS#installation

上面 inversify 需要手动绑定依赖关系。使用 inversify-binding-decorators 则可以让我们使用 装饰器 decorator 来声明绑定：

```javascript
import { injectable, Container } from "inversify";
import { provide, buildProviderModule } from "inversify-binding-decorators";
import "reflect-metadata";

@provide(Katana)
class Katana implements Weapon {
    public hit() {
        return "cut!";
    }
}

@provide(Shuriken)
class Shuriken implements ThrowableWeapon {
    public throw() {
        return "hit!";
    }
}

var container = new Container();
// Reflects all decorators provided by this package and packages them into 
// a module to be loaded by the container
container.load(buildProviderModule());
```

### typescript

ts-node 可以使我们直接运行ts文件,而不用将ts编译为js文件后再执行,使用它,我们就能快速的进行ts的调试.

nodemon 可以监控文件的修改,当文件某文件一旦被修改,nodemon就会自动重启程序,以实现热重载.

热重载：

```json
{
  "watch-server": "nodemon --watch 'src/**/*' -e ts,tsx --exec 'ts-node' ./src/server.ts"
}
```
- —watch 'src/**/*': 监听src目录下的文件
- -e ts,tsx: 监听ts和tsx文件
- —exrc 'ts-node' ./src/server.ts: 执行方式是使用ts-node运行./src/server.t文件

安装 @types/node
```javascript
cnpm install -D @types/node
```

### ts 前端参数校验

先要分清楚，强类型和弱类型、静态类型和动态类型是两组不同的概念，类型强弱是针对类型转换是否显示来区分，静态和动态类型是针对类型检查的时机来区分。

静态类型语言和动态类型语言得核心区别在于，静态类型语言（statically-typed languages）会在编译时（compile time）进行类型检查，而动态语言（dynamically-typed）则是在运行时进行类型检查（runtime）

参考：https://blog.csdn.net/w_l_l/article/details/83031080

所以typescript没有办法进行运行时的类型检查，因此运行时的数据检查需要借助一些第三方工具。

常用的运行时数据类型校验：
- PropTypes
- json-scame
- class-validator + class-transformer

使用class-validator+ class-transformer实践
- dtos 文件下定义接口数据
- 利用class-transformer将json转成指定类的对象，然后使用
- class-validator做校验

封装 validator 中间件

typescript中 mongoose 写法：https://brianflove.com/2016/10/04/typescript-declaring-mongoose-schema-model/

demo：User

```javascript
//IUser
export interface IUser {
  email?: string;
  firstName?: string;
  lastName?: string;
}
```


开源模块可以参考：https://github.com/microsoft/TypeScript-Node-Starter 

bug记录：
加了populate之后提示这个错误 Schema hasn't been registered for model "User" ？
用populate查询的时候 要注意comments模式里的ref指向的user 要和 mongoose.model()里面的user一样 注意大小写