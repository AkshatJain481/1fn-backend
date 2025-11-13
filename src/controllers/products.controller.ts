import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dtos/create-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description: 'Retrieve all products with populated variants and EMI plans',
  })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Get product by slug',
    description: 'Retrieve product using SEO-friendly slug',
  })
  @ApiParam({ name: 'slug', example: 'iphone-17-pro' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get products by category' })
  @ApiParam({ name: 'category', example: 'smartphones' })
  @ApiResponse({ status: 200, description: 'Products retrieved' })
  async findByCategory(@Param('category') category: string) {
    return this.productsService.findByCategory(category);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search products',
    description: 'Full-text search in product name and description',
  })
  @ApiQuery({ name: 'q', description: 'Search query', example: 'iphone' })
  @ApiResponse({ status: 200, description: 'Search results' })
  async search(@Query('q') query: string) {
    return this.productsService.search(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: CreateProductDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product updated' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: Partial<CreateProductDto>,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete product',
    description: 'Deletes product and all associated variants and EMI plans',
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 204, description: 'Product deleted' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async delete(@Param('id') id: string) {
    await this.productsService.delete(id);
  }
}
