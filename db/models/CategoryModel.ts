import {Document, Schema, Model, model} from 'mongoose'

export interface ICategory extends Document{
  // 分类名称
	name: string,

	// 分类描述
	desc: string,

	// 创建日期
	create_time: Date,

	// 最后修改日期
	update_time: Date
}

const CategorySchema:Schema = new Schema({
  // 分类名称
	name: { type: String, required: true, validate: /\S+/ },

	// 分类描述
	desc: { type: String, default: '' },

	// 创建日期
	create_time: { type: Date, default: Date.now },

	// 最后修改日期
	update_time: { type: Date, default: Date.now }
})

const Category: Model<ICategory> = model<ICategory>("Category", CategorySchema);

export default Category