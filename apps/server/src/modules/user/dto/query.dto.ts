import { Transform } from 'class-transformer';
import { IsDefined, IsInt, IsOptional } from 'class-validator';

export class QueryDto {
  @IsOptional()
  @IsDefined()
  search?: string;

  @IsOptional()
  @IsDefined()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @IsOptional()
  @IsDefined()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  page?: number;
}
