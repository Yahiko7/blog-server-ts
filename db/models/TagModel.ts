import mongoose, {Document, Schema } from 'mongoose'

export interface ITag extends Document{
	name: string,
	desc: string,
	icon: string,
	create_time: Date,
	update_time: Date,
}


const TagSchema:Schema = new Schema({
  // 标签名称
	name: { type: Schema.Types.String, required: true, validate: /\S+/ },

	// 标签描述
	desc: Schema.Types.String,

	// 图标
	icon: Schema.Types.String,

	// 发布日期
	create_time: { type: Schema.Types.Date, default: Date.now },

	// 最后修改日期
	update_time: { type: Schema.Types.Date, default: Date.now },
})

export default mongoose.model<ITag>("Tag",TagSchema)

