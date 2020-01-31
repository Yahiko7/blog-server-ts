import { provide } from 'inversify-binding-decorators';
import {Error, default as mongoose} from "mongoose";
import TAGS from '../contanst/tags';
import Tag, {ITag} from "../db/models/tag.db.model";

@provide(TAGS.TagService)
export class TagService{

  private test = [
      {
          email: "yuanzhijia@yidengfe.com",
          name: "老袁"
      },
      {
          email: "laowang@yidengfe.com",
          name: "老王"
      }
  ]

  public async getTags(): Promise<ITag[]> {
    return Tag.find()
        .then((data: ITag[]) => {
            return data;
        })
        .catch((error: Error) => {
            throw error;
        });
  }
    // public getUser(id: string): Model.User {
    //     let res: Model.User;
    //     res = this.userStorage[id];
    //     return res;
    // }
}