import {interfaces, TYPE, httpGet, controller, httpPost} from 'inversify-koa-utils';

import { inject } from 'inversify';
import Router from 'koa-router'
import TAGS from '../contanst/tags';
import {provideThrowable} from '../ioc/ioc';
import RegisterDto from '../dtos/users/register.dto'
import { IUser } from '../db/models/UserModel'
import axios from 'axios'
import {GITHUB} from '../config'
import { decodeQuery } from '../utils'
import { createToken } from '../utils/token'

/**
 * 读取 github 用户信息
 * @param {String} username - github 登录名
 */
async function getGithubInfo(username) {
  const result = await axios.get(`${GITHUB.fetch_user}${username}`)
  return result && result.data
}

@controller('/user')
@provideThrowable(TYPE.Controller, 'UserController')
export default class UserController implements interfaces.Controller{
  private userService;
  constructor(@inject(TAGS.UserService) userService){
    this.userService = userService
  }
  //管理后台登录
  @httpGet("/loginAdmin")
  async loginAdmin(ctx: Router.IRouterContext){
    if(ctx.session.userInfo){
      ctx.body = {
        code: 200,
        userInfo: ctx.session.userInfo
      }
      return 
    }
    const {username,password} = ctx.request.query
    let userInfo = await this.userService.findOne({username,password});
    if (userInfo) {
      if (userInfo.role === 1) {
        //登录成功后设置session
        ctx.session.userInfo = userInfo;
        ctx.body = {
          code: 200,
          msg: '登录成功',
          data: userInfo
        }
      } else {
        ctx.throw(403,'只有管理员才能登录后台！')
      }
    } else {
      ctx.throw(400,'用户名或者密码错误')
    }
  }
  //注册
  @httpPost("/register")
  async register(ctx: Router.IRouterContext){
    let validator = await ctx.validate(RegisterDto,ctx.request.body);
    const { username, password, email, phone = "",introduce = "", type = 1 }: IUser = ctx.request.body;
    const result:IUser = await this.userService.findOne({ email });
    if (result) {
      ctx.throw(403, '邮箱已被注册')
      return 
    } 
    
    //保存到数据库
    const user:IUser = await this.userService.create({
      username,
      password: password,
      email,
      phone,
      type,
      introduce,
    })
    ctx.body = {
      code: 200,
      msg: '注册成功',
      data: user
    }
  }

  // github 登录
  async githubLogin(ctx: Router.IRouterContext, code: string) {
    const result:any = await axios.post(GITHUB.access_token_url, {
      client_id: GITHUB.client_id,
      client_secret: GITHUB.client_secret,
      code
    })

    const { access_token } = decodeQuery(result.data)

    if (access_token) {

      const result2 = await axios.get(`${GITHUB.fetch_user_url}?access_token=${access_token}`)
      const githubInfo = result2.data

      let target:IUser = await this.userService.findOne({ github_id: githubInfo.id }) // 在数据库中查找该用户是否存在

      if (!target) {
        target = await this.userService.create({
          github_id: githubInfo.id,
          username: githubInfo.name || githubInfo.username,
          github: JSON.stringify(githubInfo),
          type: 2,
          email: githubInfo.email
        })
      } else {
        if (target.github !== JSON.stringify(githubInfo)) {
          // github 信息发生了变动
          const { login, email } = githubInfo
          const data = {
            username: login,
            email,
            github: JSON.stringify(githubInfo)
          }
          await this.userService.updateOne({_id:target._id},data) 
        }
      }
      ctx.body = {
        code: 200,
        data: {
          github: githubInfo,
          username: target.username,
          userId: target._id,
          role: target.role,
        }
      }
    } else {
      ctx.throw(403, 'github 授权码已失效！')
    }
  }

  /**
   * 初始化用户
   * @param {String} githubLoginName - github name
   */
  async initGithubUser(githubLoginName:string) {
    const github = await getGithubInfo(githubLoginName)
    const temp:IUser = await this.userService.findOne({ github_id: github.id })
    if (!temp) {
      this.createGithubUser(github, 1, 0)
    }
  }
  // 创建用户
  async createGithubUser(githubInfo, role: number,type:number){
    const { id, login, email } = githubInfo
    this.userService.create({
      username: login,
      role,
      email,
      github_id: id,
      type: type,
      github: JSON.stringify(githubInfo)
    })
  }

  
}
