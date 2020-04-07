import {Document, Schema, Model, model } from 'mongoose'
import TagModel,{ITag} from './TagModel'
import CategoryModel,{ICategory} from './CategoryModel'
import CommentModel,{IComment} from './CommentModel'


//文章发布状态 => 0 草稿，1 已发布
type ArticleStatus = 0 | 1

export interface IArticle extends Document {
  title: string,
  content: string,
  view_count: number,
  //创建日期
  create_time: Date,

  //最后修改日期
  update_time: Date,

  // 文章标签
  tags: ITag[]

  // 文章分类
	categorys: ICategory[],

  comments: IComment[],

  // 作者
  author: string,
  
  // 文章描述
  desc: string,
  
  // 字数
  numbers: string,
  
  // 文章发布状态 => 0 草稿，1 已发布
	state: ArticleStatus,
}

const ArticleSchema: Schema = new Schema({
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  view_count: {
    type: Number,
    default: 0
  },
  //创建日期
  create_time: {
    type: Date,
    default: Date.now
  },

  //最后修改日期
  update_time: {
    type: Date,
    default: Date.now
  },

  // 文章标签
	tags: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Tag', 
    required: true 
  }],

  // 文章分类
	categorys: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  }],

  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', required: true }],

  // 作者
  author: { type: String, required: true, validate: /\S+/ },
  
  // 文章描述
  desc: { type: String, default: '' },
  
  // 字数
  numbers: { type: String, default: 0 },
  
  // 文章发布状态 => 0 草稿，1 已发布
	state: { type: Number, default: 1 },
})

const article : Model<IArticle> = model<IArticle>("Article",ArticleSchema)

export default article
