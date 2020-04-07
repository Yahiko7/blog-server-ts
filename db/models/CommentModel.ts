import {Document, Schema, Model, model} from 'mongoose'
import {IUser} from './UserModel'

// 状态 => 0 待审核 / 1 通过正常 / -1 已删除 / -2 垃圾评论
type CommentState = 0 | 1 | -1 | -2;

interface CommentReplay {
  // 谁在评论
  user: IUser,

  // 对谁评论
  to_user: IUser,

  // 被赞数
  likes: number,

  // content
  content: string,

	state: CommentState,
	
}

export interface IComment extends Document {
  // 评论所在的文章 id
	article_id: Schema.Types.ObjectId,

	// content
	content: string,

	// 是否置顶
	is_top?: boolean,

	// 被赞数
	likes: number,

	// 用户 id
	user_id: Schema.Types.ObjectId,

	// 父评论的用户信息
	user: IUser,

	// 第三者评论
	other_comments?: Array<CommentReplay>,

	// 状态 => 0 待审核 / 1 通过正常 / -1 已删除 / -2 垃圾评论
	state?: number,

	// 是否已经处理过 => 1 是 / 2 否 ；新加的评论需要审核，防止用户添加 垃圾评论
	is_handle?: number,

	// 最后修改日期
	update_time: Date,
}


const CommentSchema:Schema = new Schema({
  // 评论所在的文章 id
	article_id: { type: Schema.Types.ObjectId, required: true },

	// content
	content: { type: String, required: true, validate: /\S+/ },

	// 是否置顶
	is_top: { type: Boolean, default: false },

	// 被赞数
	likes: { type: Number, default: 0 },

	// 用户 id
	user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },

	// 父评论的用户信息
	user: {
		// 用户id
		user_id: { type: Schema.Types.ObjectId },

		// 名字
		name: { type: String, required: true, default: '' },

		// 用户类型 0：博主 1：其他用户
		type: { type: Number, default: 1 },

		// 头像
		avatar: { type: String, default: 'user' },
	},

	// 第三者评论
	other_comments: [
		{
			// 谁在评论
			user: {
				user_id: { type: Schema.Types.ObjectId },

				// 名字
				name: { type: String, required: true, default: '' },

				// 用户类型 0：博主 1：其他用户
				type: { type: Number, default: 1 },

				// 头像
				avatar:{type: String,  default: 'user' }
			},

			// 对谁评论
			to_user: { 
				user_id: { type: Schema.Types.ObjectId },

				// 名字
				name: { type: String, required: true, default: '' },

				// 用户类型 0：博主 1：其他用户
				type: { type: Number, default: 1 },

				// 头像
				avatar:{type: String,  default: 'user' }
			},

			// 被赞数
			likes: { type: Number, default: 0 },

			// content
			content: { type: String, required: true, validate: /\S+/ },

			// 状态 => 0 待审核 / 1 通过正常 / -1 已删除 / -2 垃圾评论
			state: { type: Number, default: 1 },

			// 创建日期
			create_time: { type: Date, default: Date.now },
		},
	],

	// 状态 => 0 待审核 / 1 通过正常 / -1 已删除 / -2 垃圾评论
	state: { type: Number, default: 1 },

	// 是否已经处理过 => 1 是 / 2 否 ；新加的评论需要审核，防止用户添加 垃圾评论
	is_handle: { type: Number, default: 2 },

	// 创建日期
	create_time: { type: Date, default: Date.now },

	// 最后修改日期
	update_time: { type: Date, default: Date.now },
})

const comment:Model<IComment> = model<IComment>("Comment",CommentSchema)

export default comment