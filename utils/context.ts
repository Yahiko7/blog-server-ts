import { validate as classValidator} from "class-validator";
import { plainToClass } from 'class-transformer';
import Router from 'koa-router' 
/**
 *
 * @param {Object} params - 需要被验证的 key-value
 * @param {Object} dto - 验证规则
 * @return Promise
 */
async function validate( dto,params = {} ):Promise<boolean> {
  const ctx = this
  const validator = await classValidator(plainToClass(dto,params),{ validationError: { target: false } })
  if(validator.length > 0){
    ctx.throw(400, Object.values(validator[0].constraints))
    return false
  }
  return true
  
}
// 绑定 app.context  ctx.func 直接调用
export default {
  // client: response, // 快捷设置给客户端的 response
  validate: validate
}
