import {interfaces, TYPE, httpGet, controller, httpPost, httpDelete,requestParam} from 'inversify-koa-utils';

import { inject } from 'inversify';
import Router from 'koa-router'
import TAGS from '../contanst/tags';
import {provideThrowable} from '../ioc/ioc';
import AddDto from '../dtos/tag/add.dto'
import { ITag } from '../db/models/tag.db.model';

@controller('/tag')
@provideThrowable(TYPE.Controller, 'TagController')
export class TagController implements interfaces.Controller{
  private tagService;
  constructor(@inject(TAGS.TagService) tagService){
    this.tagService = tagService
  }
  // constructor( @inject(TAGS.TagService) private tagService ) {}
  @httpGet("/list")
  public async getTags(ctx: Router.IRouterContext, next: () => Promise<any>){

    let { pageSize = 10, pageNum = 1 }:{pageSize:number,pageNum:number}= ctx.query;
    
    let skip:number = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;

    let options = {
      skip: skip,
      limit: pageSize,
      sort: { create_time: -1 },
    };

    const [total,list] = await Promise.all([
      this.tagService.countDocuments(),
      this.tagService.find({}, "name _id", options)
    ])
    ctx.body = {
      code: 200,
      total: total,
      list: list
    }
  }
  @httpPost("/add")
  async add(ctx: Router.IRouterContext){

    let validator = await ctx.validate(AddDto,ctx.request.body)

    const { name }: AddDto = ctx.request.body
    
    const result:ITag = await this.tagService.findOne({
      name
    })
    
    if(result){
      ctx.throw(403, '创建失败，该标签已存在！')
    }else{
      await this.tagService.add({name});
      ctx.body = {
        status: 200,
        result: 'success',
        msg: '添加成功'
      }
    }

  }

  @httpDelete("/del/:id")
  async delete(@requestParam("id") id: string, ctx: Router.IRouterContext){
    
    await this.tagService.deleteOne(id)
    ctx.body = {
      code: 200,
      msg: '删除成功'
    }
  }

  
}
