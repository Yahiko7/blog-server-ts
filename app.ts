import { Container } from 'inversify'
import { InversifyKoaServer, TYPE} from 'inversify-koa-utils'
import { buildProviderModule } from 'inversify-binding-decorators'
import 'reflect-metadata';
import './controllers/TagController'
import './services/TagService'
import * as log4js from 'log4js'
// import * as db from './mongoose/db'
import {DbConnection} from "./db/utils/connection.db";
import path from 'path'
import json from 'koa-json'
import bodyparser from 'koa-bodyparser'
import koaLogger from 'koa-logger'
import session from 'koa-session'
import ioredis from 'ioredis'
import Store from './utils/redis-store'
import context from './utils/context'
import CorsHandler from './middlewares/cors' 
import ErrorHandler from './middlewares/error'
import SessionCheck from './middlewares/sessionCheck'

log4js.configure({
  appenders: { cheese: { type: 'file', filename: path.resolve(__dirname,'./log/error.log')} },
  categories: { default: { appenders: ['cheese'], level: 'error' } }
});

const container = new Container();
container.load(buildProviderModule())

// import * as Joi from 'joi'
// import * as JoiPhoneNumber from 'joi-phone-number'
// Joi.extend(JoiPhoneNumber)

const server = new InversifyKoaServer(container)

server.setConfig((app) => {
  app.use(bodyparser({
    enableTypes:['json', 'form', 'text']
  }))
  app.use(json())
  app.use(koaLogger())

  app.keys = ['hook_id'];
  app.use(session({
    key: 'hook_id', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 400000,
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: true, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
    store: new Store()
  }, app));

  Object.keys(context).forEach(key => {
    app.context[key] = context[key] // 绑定上下文对象
  })
  CorsHandler(app)
  const logger = log4js.getLogger('cheese');
  //404错误页面
  ErrorHandler.error404(app,logger)

  // 错误处理函数 同步操作 error handler
  ErrorHandler.error500(app,logger)

  //session 校验
  SessionCheck(app)
});

// import Promise from 'bluebird'
// global.Promise = Promise

//数据库连接
DbConnection.initConnection();

DbConnection.setAutoReconnect();

const app = server.build();

app.listen(3000, () => {
  console.log("server at port: 3000")
})