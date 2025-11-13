import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { VariantsService } from '../services/variants.service';
import { CreateVariantDto } from '../dtos/create-variant.dto';

@ApiTags('Variants')
@Controller('variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all variants',
    description: 'Retrieve all product variants (storage/color combinations)',
  })
  @ApiResponse({ status: 200, description: 'Variants retrieved successfully' })
  async findAll() {
    return this.variantsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get variant by ID',
    description: 'Retrieve a single variant by MongoDB ObjectId',
  })
  @ApiParam({
    name: 'id',
    description: 'Variant MongoDB ObjectId',
    example: '674b1234567890abcdef1234',
  })
  @ApiResponse({ status: 200, description: 'Variant found' })
  @ApiResponse({ status: 404, description: 'Variant not found' })
  async findById(@Param('id') id: string) {
    return this.variantsService.findById(id);
  }

  @Get('product/:productId')
  @ApiOperation({
    summary: 'Get variants by product ID',
    description:
      'Retrieve all variants (storage/color options) for a specific product',
  })
  @ApiParam({
    name: 'productId',
    description: 'Product ID',
    example: '674a1234567890abcdef1234',
  })
  @ApiResponse({ status: 200, description: 'Product variants retrieved' })
  async findByProductId(@Param('productId') productId: string) {
    return this.variantsService.findByProductId(productId);
  }

  @Get('color/:color')
  @ApiOperation({
    summary: 'Get variants by color',
    description: 'Filter variants by color (e.g., Silver, Gold, Black)',
  })
  @ApiParam({ name: 'color', description: 'Variant color', example: 'Silver' })
  @ApiResponse({ status: 200, description: 'Variants filtered by color' })
  async findByColor(@Param('color') color: string) {
    return this.variantsService.findByColor(color);
  }

  @Get('storage/:storage')
  @ApiOperation({
    summary: 'Get variants by storage',
    description: 'Filter variants by storage capacity (e.g., 128GB, 256GB)',
  })
  @ApiParam({
    name: 'storage',
    description: 'Storage capacity',
    example: '256GB',
  })
  @ApiResponse({ status: 200, description: 'Variants filtered by storage' })
  async findByStorage(@Param('storage') storage: string) {
    return this.variantsService.findByStorage(storage);
  }

  @Get(':id/stock')
  @ApiOperation({
    summary: 'Check variant stock',
    description: 'Check if a specific variant is in stock and available',
  })
  @ApiParam({ name: 'id', description: 'Variant ID' })
  @ApiResponse({ status: 200, description: 'Stock status retrieved' })
  @ApiResponse({ status: 404, description: 'Variant not found' })
  async checkStock(@Param('id') id: string) {
    const inStock = await this.variantsService.checkStock(id);
    return { inStock };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new variant',
    description: 'Add a new storage/color variant to a product',
  })
  @ApiBody({ type: CreateVariantDto })
  @ApiResponse({ status: 201, description: 'Variant created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() createVariantDto: CreateVariantDto) {
    return this.variantsService.create(createVariantDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update variant',
    description: 'Update existing variant details (price, stock, etc.)',
  })
  @ApiParam({ name: 'id', description: 'Variant ID' })
  @ApiBody({ type: CreateVariantDto })
  @ApiResponse({ status: 200, description: 'Variant updated successfully' })
  @ApiResponse({ status: 404, description: 'Variant not found' })
  async update(
    @Param('id') id: string,
    @Body() updateVariantDto: Partial<CreateVariantDto>,
  ) {
    return this.variantsService.update(id, updateVariantDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete variant',
    description: 'Remove a variant from the database',
  })
  @ApiParam({ name: 'id', description: 'Variant ID' })
  @ApiResponse({ status: 204, description: 'Variant deleted successfully' })
  @ApiResponse({ status: 404, description: 'Variant not found' })
  async delete(@Param('id') id: string) {
    await this.variantsService.delete(id);
  }
}
