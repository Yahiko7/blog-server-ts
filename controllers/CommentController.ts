
import { TYPE, interfaces, httpGet, httpPost, httpDelete, controller, requestParam} from 'inversify-koa-utils'
import {inject} from 'inversify'
import TAGS from '../contanst/TAGS'
import Router from 'koa-router'
import {provideThrowable} from '../ioc/ioc';
import AddDto from '../dtos/comment/add.dto'
import {IUser} from '../db/models/UserModel'
import { IArticle } from '../db/models/ArticleModel';

@controller('/comment')
@provideThrowable(TYPE.Controller, 'CommentController')
export default class CommentController implements interfaces.Controller{

  private commentService;
  private userService;
  private articleService;

  constructor(@inject(TAGS.CommentService) commentService, 
              @inject(TAGS.UserService) userService,
              @inject(TAGS.ArticleService) articleService){
    this.commentService = commentService
    this.userService = userService
    this.articleService = articleService
  }
  
  @httpPost("/add")
  async addComment(ctx:Router.IRouterContext){

    await ctx.validate(AddDto,ctx.request.body)
    

    let { article_id, user_id, content }: AddDto = ctx.request.body;

    let userData:IUser = await this.userService.findOne({ _id: user_id})

    if(userData){
      let userInfo = {
        user_id: userData._id,
        name: userData.username,
        type: userData.type,
        avatar: userData.avatar,
      };
      let commentData = await this.commentService.add({
        article_id: article_id,
        content: content,
        user_id: user_id,
        user: userInfo,
      })

      let articleData:IArticle = await this.articleService.findOne({_id:article_id})

      if(!articleData){
        return ctx.throw(400,'文章不存在')
      }

      articleData.comments.push(commentData._id);
      
      await this.articleService.updateOne(
        { _id: article_id },
        { comments: articleData.comments},
      )
      
      ctx.body = {
        code: 200,
        msg: '评论成功'
      }

    }else{
      ctx.throw(400,'用户不存在')
    }

  }
}