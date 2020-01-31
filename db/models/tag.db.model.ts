import * as mongoose from "mongoose";
import {Document, Schema } from 'mongoose'

export interface ITag extends Document {
    // 标签名称
    name: string;
    // 发布日期
    create_time: Date,
}

const TagSchema: Schema = new Schema({
    // 标签名称
    name: { type: String, required: true, validate: /\S+/ },
    
    // 发布日期
    create_time: { type: Date, default: Date.now },
});

// const model: Model = mongoose.model('tag', TagSchema)

// export default model;
export default mongoose.model<ITag>("Tag", TagSchema);
