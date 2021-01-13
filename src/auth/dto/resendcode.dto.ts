import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ResendcodeDto {

  @ApiProperty()
  @IsNotEmpty()
  username: string;

}
