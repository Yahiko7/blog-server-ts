import { provide } from 'inversify-binding-decorators' 
import TAGS from '../contanst/tags'
import CommentModel, {IComment} from '../db/models/CommentModel'

@provide(TAGS.CommentService)
export default class CommentService{

  async findOne(tag: IComment):Promise<IComment>{

    return CommentModel.findOne(tag)
  }
    
  async add(tag: IComment):Promise<IComment>{
    return (new CommentModel(tag)).save()
  }

  countDocuments(){
    return CommentModel.countDocuments()
  }

  async find(conditions = {}, fields:string , options):Promise<IComment[]>{
    return CommentModel.find(conditions, fields, options)
  }

  async deleteOne(id:string){
    return CommentModel.deleteOne({ _id: id })
  }
}

