import { IsString } from 'class-validator'

export default class AddDto{
  @IsString()
  name: string
}