import * as mongoose from 'mongoose'
import modelTags from '../contanst/modelTags'
import { provide } from 'inversify-binding-decorators';
const Schema = mongoose.Schema;
const tagSchema = new Schema({
  // 标签名称
  name: { type: String, required: true, validate: /\S+/ },
  
  // 发布日期
	create_time: { type: Date, default: Date.now },

})

//唯一索引
tagSchema.index({
	name: 1,
	type: 1
}, {
	unique: true
})

export const TagModel = mongoose.model('tag', tagSchema)
