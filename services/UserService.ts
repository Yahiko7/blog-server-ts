import { provide } from 'inversify-binding-decorators';
import TAGS from '../contanst/tags';
import UserModel, {IUser} from "../db/models/UserModel";
@provide(TAGS.UserService)
export default class UserService{

  public async findOne( user: IUser ): Promise<IUser> {
    return UserModel.findOne(user)
  }

  public async create( user: IUser): Promise<IUser>{
    return new UserModel(user).save()
  }

  public async updateOne( filter:IUser, user: IUser,  ): Promise<IUser>{
    return UserModel.updateOne(filter,user)
  }


}