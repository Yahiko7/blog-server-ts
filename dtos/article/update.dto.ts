import { IsString, IsNotEmpty, IsArray, IsNumber, IsIn, Length } from 'class-validator'

export default class UpdateDto{
  @IsString()
  @IsNotEmpty()
  @Length(24,24)
  articleId: string

  @IsString()
  title: string

  @IsString()
  content: string

  @IsArray()
  @IsString({
    each: true
  })
  @Length(24,24,{
    each: true
  })
  categorys: string[]

  @IsArray()
  @IsString({
    each: true
  })
  @Length(24,24,{
    each: true
  })
  tags: string[]

}

