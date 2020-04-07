import { IsString, IsNotEmpty, IsArray, IsNumber, IsIn } from 'class-validator'

export default class CreateDto{
  
  @IsString()
  @IsNotEmpty()
  author: string

  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  content: string

  @IsArray()
  @IsString({
    each: true
  })
  categorys: string[]

  @IsArray()
  @IsString({
    each: true
  })
  tags: string[]

  @IsIn([0,1])
  state: number
}

