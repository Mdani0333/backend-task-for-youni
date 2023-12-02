import { IsOptional, IsNotEmpty, ValidateIf } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  price?: number;

  @IsOptional()
  description?: string;
}
