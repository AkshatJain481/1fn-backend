import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  Max,
  IsNotEmpty,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmiPlanDto {
  @ApiProperty({
    example: '674a1234567890abcdef1234',
    description: 'Product ID (MongoDB ObjectId)',
  })
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    example: 12,
    description: 'EMI tenure in months',
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  tenure: number;

  @ApiProperty({
    example: 11492,
    description: 'Monthly payment amount',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  monthlyPayment: number;

  @ApiProperty({
    example: 0,
    description: 'Interest rate percentage (0 for zero-interest)',
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  interestRate: number;

  @ApiPropertyOptional({
    example: 199,
    description: 'Processing fee amount',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  processingFee?: number;

  @ApiPropertyOptional({
    example: 0,
    description: 'Down payment amount',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  downPayment?: number;

  @ApiPropertyOptional({
    example: 5000,
    description: 'Cashback amount',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  cashback?: number;

  @ApiPropertyOptional({
    example: 'No cost EMI for 12 months',
    description: 'Plan description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether plan is active',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Mark as recommended plan',
  })
  @IsOptional()
  @IsBoolean()
  isRecommended?: boolean;
}
