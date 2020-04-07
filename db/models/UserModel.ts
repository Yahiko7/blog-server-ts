import * as mongoose from "mongoose";
import {Document, Schema } from 'mongoose'
import config from '../../config'
const crypto = require('crypto');

export interface IUser extends Document {
  github_id: string;
  username: string;
  type: number;
  role: number;
  phone: string;
  img_url: string;
  email: string;
  introduce: string;
  avatar: string;
  location: string;
  password: string;
  create_time: Date;
  update_time: Date;
  github: string;

  _id: Schema.Types.ObjectId

}

const UserSchema: Schema = new Schema({
  //第三方授权登陆的github用户ID
  github_id: {
    type: String,
    default: ''
  },

  //名字
  username: {
    type: String,
    required: true,
    default: ''
  },

  //用户类型 0:博主 1:普通用户 2:github 3：weixin， 4：qq ( 0，1 是注册的用户； 2，3，4 都是第三方授权登录的用户)
  type: {
    type: Number,
    default: 1
  },

  //用户权限 1 管理员 0 普通用户
  role: {
    type: Number,
    default: 0
  },

  //手机
  phone: {
    type: String,
    default: ''
  },

  //封面
  img_url: {
    type: String,
    default: ''
  },

  //邮箱
  email: {
    type: String,
    default: ''
  },

  github: {
    type: String,
    default: ''
  },
  
  //个人简介
  introduce: {
    type: String,
    default: ''
  },

  //头像
  avatar: {
    type: String,
    default: ''
  },

  // 地址
  location: { type: String, default: '' },

  password: {
    type: String,
    required: true,
    default: crypto.createHash('md5')
                  .update(config.auth_default_password)
                  .digest('hex')
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
  }
});

UserSchema.pre<IUser>("save", function(next) {
  let now = new Date();
  if (!this.create_time) {
    this.create_time = now;
  }
  next();
});

/**
 * Password hash middleware.
 */
// userSchema.pre("save", function save(next) {
//   const user = this as UserDocument;
//   if (!user.isModified("password")) { return next(); }
//   bcrypt.genSalt(10, (err, salt) => {
//       if (err) { return next(err); }
//       bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
//           if (err) { return next(err); }
//           user.password = hash;
//           next();
//       });
//   });
// });
// 参考：https://github.com/microsoft/TypeScript-Node-Starter 

export default mongoose.model<IUser>("User", UserSchema);
