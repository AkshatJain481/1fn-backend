import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  IsNotEmpty,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVariantDto {
  @ApiProperty({
    example: '674a1234567890abcdef1234',
    description: 'Product ID (MongoDB ObjectId)',
  })
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    example: '256GB',
    description: 'Storage capacity',
  })
  @IsString()
  @IsNotEmpty()
  storage: string;

  @ApiProperty({
    example: 'Silver',
    description: 'Color variant',
  })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    example: 139900,
    description: 'Variant price',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({
    example: 149900,
    description: 'Maximum Retail Price',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  mrp: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Stock availability',
  })
  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @ApiPropertyOptional({
    example: 50,
    description: 'Available stock quantity',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stockQuantity?: number;

  @ApiPropertyOptional({
    example: 'IPH17-256-SLV',
    description: 'Stock Keeping Unit',
  })
  @IsOptional()
  @IsString()
  sku?: string;
}
