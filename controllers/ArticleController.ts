import {interfaces, TYPE, httpGet, controller, httpPost, httpPut, requestParam} from 'inversify-koa-utils';
import { inject } from 'inversify';
import {provideThrowable} from '../ioc/ioc';
import TAGS from '../contanst/tags';
import Router from 'koa-router'
import CreateDto from '../dtos/article/create.dto'
import ListDto from '../dtos/article/list.dto'
import UpdateDto from '../dtos/article/update.dto'
import { IArticle } from '../db/models/ArticleModel';

import ArticleModel from '../db/models/ArticleModel'

@controller('/article')
@provideThrowable(TYPE.Controller, 'ArticleController')
export default class ArticleController implements interfaces.Controller{
  private articleService;
  constructor(@inject(TAGS.ArticleService) articleService){
    this.articleService = articleService
  }
  @httpPost("/create")
  async create(ctx: Router.IRouterContext){


    const validator:boolean = ctx.validate(CreateDto,ctx.request.body)

    if (validator) {
      const { title, author, content, tags, categorys, state = 1 }: CreateDto = ctx.request.body;
      const result:IArticle = await this.articleService.findOne({ title })
      if (result) {
        ctx.throw(403, '创建失败，该文章已存在！')
      } else {

        await new this.articleService.create({ title, author, content, numbers: content.length, tags, categorys, state })

        ctx.body = {
          status: 200,
          result: 'success',
          msg: '保存成功'
        }

      }
    }
  }
  @httpGet("/detail/:id")
  async detail(ctx: Router.IRouterContext){

    const data:IArticle = await this.articleService.findOne({
      id: ctx.params.id
    })

    ctx.body = {
      code: 200,
      data: data
    }
  }
  @httpGet("/list")
  async getList(ctx: Router.IRouterContext){
    
    // ctx.validate(ctx.query, {
    //   pageNum: Joi.string(),
    //   pageSize: Joi.number(),
    //   keyword: Joi.string(), // 关键字查询
    //   category: Joi.string().length(24),
    //   tag: Joi.string().length(24),
    //   order: Joi.string(),
    //   state: Joi.number()
    // })
    
    await ctx.validate(ListDto,ctx.query);

    let { pageSize = 10, pageNum = 1, keyword = '', category = '', tag = '', order, state = 1 } : ListDto = ctx.query;
    
    // 如果是文章归档 返回全部文章
    // if (article) {
    //   pageSize = 1000;
    // }
    const keywordReg = new RegExp(keyword, "i")
    let conditions: any = {
      $and: [
        { $or: [{ state: state }] },
        {
          $or: [
            { title: { $regex: keywordReg } },
            { content: { $regex: keywordReg } },
          ],
        }
      ]
    };
    if (tag) {
      conditions.$and.push({
        $or: [{ tags: { $in: [tag] } }]
      })
    }
    if (category) {
      conditions.$and.push({
        $or: [{ categorys: { $in: [category] } }]
      })
    }

    let skip:number = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;

    let fields = { title: 1, content: 1, tags: 1, categorys: 1, create_time: 1 };
    // if (article) {
    //   fields = {
    //     title: 1,
    //     create_time: 1,
    //   };
    // }
    let options = {
      skip: skip,
      limit: pageSize,
      sort: { create_time: -1 },
    };
    const [total,list] = await Promise.all([
      this.articleService.countDocuments(conditions),
      this.articleService.find(conditions, fields, options)
    ])
    ctx.body = {
      code: 200,
      total: total,
      list: list
    }
  }

  @httpPut("/update/:id")
  async update(@requestParam("id") id:string, ctx: Router.IRouterContext){
    
    await ctx.validate(UpdateDto,{
      articleId: id,
      ...ctx.request.body
    })
    
    const { title, content, tags, categorys }: UpdateDto = ctx.request.body;
    const updateObj = this.articleService.findOne({ title, content, tags, categorys },ctx.request.body);
    await ArticleModel.updateOne(
      { _id: ctx.params.id },
      updateObj
    )
      
    ctx.body = {
      code: 200,
      msg: '修改成功'
    }
  }
}