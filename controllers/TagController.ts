import {interfaces, TYPE, httpGet, controller} from 'inversify-koa-utils';

import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import TYPES from '../contanst/types'
import Router from 'koa-router'
import TAGS from '../contanst/tags';
import {provideThrowable} from '../ioc/ioc';

@controller('/tag')
// @injectable()
// @provide(TYPES.TagController)
@provideThrowable(TYPE.Controller, 'TagController')
export class TagController implements interfaces.Controller{
  private tagService;
  constructor(@inject(TAGS.TagService) tagService){
    this.tagService = tagService
  }
  // constructor( @inject(TAGS.TagService) private tagService ) {}
  @httpGet("/")
  public async getTags(ctx: Router.IRouterContext, next: () => Promise<any>): Promise<any> {
      const content = await this.tagService.getTags();
      throw Error("aa")
      ctx.body = {
        code: 200,
        msg: content
      }
  }
}
