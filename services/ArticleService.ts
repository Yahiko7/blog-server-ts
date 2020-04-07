import { provide } from 'inversify-binding-decorators';
import TAGS from '../contanst/tags';
import ArticleModel, {IArticle} from '../db/models/ArticleModel'

@provide(TAGS.ArticleService)
export default class ArticleService{

  public async findOne( article: IArticle ): Promise<IArticle> {
    return ArticleModel.findOne(article).populate([
      { path: 'tags' },
      { path: 'comments' },
      { path: 'categorys' },
    ])
  }

  find(conditions, fields, options){
    return ArticleModel.find(conditions, fields, options).populate([
      { path: 'tags' },
      { path: 'comments' },
      { path: 'categorys' },
    ])
  }

  public async create( article: IArticle): Promise<IArticle>{
    return new ArticleModel(article).save()
  }

  public async updateOne( filter:IArticle, article: IArticle,  ): Promise<IArticle>{
    return ArticleModel.updateOne(filter,article)
  }
  
  async countDocuments(conditions):Promise<any>{
    return ArticleModel.countDocuments(conditions)
  }
  
}