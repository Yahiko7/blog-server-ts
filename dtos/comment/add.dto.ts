import { IsString, IsNotEmpty } from 'class-validator'

export default class AddDto{
  
  @IsString()
  @IsNotEmpty()
  article_id: string

  @IsString()
  @IsNotEmpty()
  user_id: string

  @IsString()
  @IsNotEmpty()

  content: string
}