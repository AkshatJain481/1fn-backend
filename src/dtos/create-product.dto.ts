import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsOptional,
  Min,
  IsNotEmpty,
  ArrayMinSize,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({
    example: 'iPhone 17 Pro',
    description: 'Product name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Apple',
    description: 'Brand name',
  })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({
    example: 'smartphones',
    description: 'Product category',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: 'Latest flagship smartphone with advanced camera system',
    description: 'Product description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 129900,
    description: 'Base price in rupees',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  basePrice: number;

  @ApiProperty({
    example: 139900,
    description: 'Maximum Retail Price',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  mrp: number;

  @ApiProperty({
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    description: 'Array of product image URLs',
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUrl({}, { each: true })
  images: string[];

  @ApiPropertyOptional({
    example: true,
    description: 'Stock availability status',
  })
  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @ApiPropertyOptional({
    example: { display: '6.7 inch', processor: 'A18 Pro', ram: '8GB' },
    description: 'Technical specifications',
  })
  @IsOptional()
  specifications?: Record<string, any>;

  @ApiProperty({
    example: 'iphone-17-pro',
    description: 'SEO-friendly URL slug (must be unique)',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;
}
