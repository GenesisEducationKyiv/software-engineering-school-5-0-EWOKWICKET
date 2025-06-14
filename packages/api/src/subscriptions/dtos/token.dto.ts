import { IsMongoId } from 'class-validator';

export class TokenDto {
  @IsMongoId()
  token: string;
}
