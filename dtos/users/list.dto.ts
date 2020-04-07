import { IsString, IsNumber} from 'class-validator'

export default class ListDto {
  @IsString()
  username: string;
  @IsNumber()
  page: string;
  @IsNumber()
  pageSize: string;

}
