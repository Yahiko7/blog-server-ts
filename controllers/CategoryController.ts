
import { TYPE, interfaces, httpGet, httpPost, httpDelete, controller, requestParam} from 'inversify-koa-utils'
import {inject} from 'inversify'
import TAGS from '../contanst/TAGS'
import Router from 'koa-router'
import {provideThrowable} from '../ioc/ioc';

@controller('/category')
@provideThrowable(TYPE.Controller, 'CategoryController')
export default class CategoryController implements interfaces.Controller{
  private categoryService;
  
  constructor(@inject(TAGS.CategoryService) categoryService){
    this.categoryService = categoryService
  }

  @httpPost("/add")
  async add(ctx:Router.IRouterContext){

    const { name }: {name:string} = ctx.request.body

    const result = await this.categoryService.findOne({ name })
    if(result){
      ctx.throw(403, '创建失败，该分类已存在！')
    }else{
      await this.categoryService.add({ name });
      ctx.body = {
        status: 200,
        result: 'success',
        msg: '添加成功'
      }
    }
  }

  @httpDelete("/del/:id")
  async delete(@requestParam("id") id: string, ctx:Router.IRouterContext){

    await this.categoryService.deleteOne({ _id: id})

    ctx.body = {
      code: 200,
      msg: '删除成功'
    }
  }

  @httpGet("/list")
  async list(ctx:Router.IRouterContext){

    let { pageSize = 10, pageNum = 1 } = ctx.query;
    
    let skip:number = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;

    let options = {
      skip: skip,
      limit: pageSize,
      sort: { create_time: -1 },
    };

    const [total,list] = await Promise.all([
      this.categoryService.countDocuments(),
      this.categoryService.find({}, "_id name", options)
    ])
    ctx.body = {
      code: 200,
      total: total,
      list: list
    }
  }
}