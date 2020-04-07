import { provide } from 'inversify-binding-decorators';
import {Error, default as mongoose} from "mongoose";
import TAGS from '../contanst/tags';
import TagModel, {ITag} from "../db/models/tag.db.model";

@provide(TAGS.TagService)
export class TagService{

  async findOne(tag: ITag):Promise<ITag>{

    return TagModel.findOne(tag)
  }
    
  async add(tag: ITag):Promise<ITag>{
    return (new TagModel(tag)).save()
  }

  countDocuments(){
    return TagModel.countDocuments()
  }

  async find(conditions = {}, fields:string , options):Promise<ITag[]>{
    return TagModel.find(conditions, fields, options)
  }

  async deleteOne(id:string){
    return TagModel.deleteOne({ _id: id })
  }
}