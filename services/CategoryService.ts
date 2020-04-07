import {provide} from 'inversify-binding-decorators'
import TAGS from '../contanst/tags'
import CategoryModel, {ICategory} from  '../db/models/CategoryModel'


@provide(TAGS.CategoryService)
export default class CategoryService{

  async findOne(category: ICategory):Promise<ICategory>{

    return CategoryModel.findOne(category)
  }
    
  async add(category: ICategory):Promise<ICategory>{
    return (new CategoryModel(category)).save()
  }

  countDocuments(){
    return CategoryModel.countDocuments()
  }

  async find(conditions = {}, fields:string , options):Promise<ICategory[]>{
    return CategoryModel.find(conditions, fields, options)
  }

  async deleteOne(id:string){
    return CategoryModel.deleteOne({ _id: id })
  }
}
