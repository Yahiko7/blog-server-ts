import {IsIn,Length,IsOptional, IsNumber, IsString} from 'class-validator'

export default class ListDto{

  @IsNumber()
  pageNum: number

  @IsNumber()
  pageSize: number

  @IsString()
  keyword: string

  @IsString()
  order: string

  @Length(24, 24)
  @IsOptional()
  category: string
  
  @Length(24, 24)
  @IsOptional()
  tag: string

  @IsIn([0,1])
  @IsOptional()
  state: number
}