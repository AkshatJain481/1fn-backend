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
  ApiBody,
} from '@nestjs/swagger';
import { EmiPlansService } from '../services/emi-plans.service';
import { CreateEmiPlanDto } from '../dtos/create-emi-plan.dto';

@ApiTags('EMI Plans')
@Controller('emi-plans')
export class EmiPlansController {
  constructor(private readonly emiPlansService: EmiPlansService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all active EMI plans',
    description: 'Retrieve all active EMI plans sorted by tenure',
  })
  @ApiResponse({ status: 200, description: 'EMI plans retrieved successfully' })
  async findAll() {
    return this.emiPlansService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get EMI plan by ID' })
  @ApiParam({
    name: 'id',
    description: 'EMI Plan MongoDB ObjectId',
    example: '674c1234567890abcdef1234',
  })
  @ApiResponse({ status: 200, description: 'EMI plan found' })
  @ApiResponse({ status: 404, description: 'EMI plan not found' })
  async findById(@Param('id') id: string) {
    return this.emiPlansService.findById(id);
  }

  @Get('product/:productId')
  @ApiOperation({
    summary: 'Get EMI plans by product ID',
    description: 'Retrieve all active EMI plans for a specific product',
  })
  @ApiParam({
    name: 'productId',
    description: 'Product ID',
    example: '674a1234567890abcdef1234',
  })
  @ApiResponse({ status: 200, description: 'EMI plans for product retrieved' })
  async findByProductId(@Param('productId') productId: string) {
    return this.emiPlansService.findByProductId(productId);
  }

  @Get('product/:productId/recommended')
  @ApiOperation({
    summary: 'Get recommended EMI plans',
    description:
      'Get all recommended EMI plans for a product (marked with isRecommended: true)',
  })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Recommended plans retrieved' })
  async findRecommended(@Param('productId') productId: string) {
    return this.emiPlansService.findRecommendedByProductId(productId);
  }

  @Get('product/:productId/cheapest')
  @ApiOperation({
    summary: 'Get cheapest EMI plan',
    description:
      'Find the EMI plan with the lowest monthly payment for a product',
  })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Cheapest plan found' })
  @ApiResponse({
    status: 404,
    description: 'No EMI plans found for this product',
  })
  async findCheapest(@Param('productId') productId: string) {
    return this.emiPlansService.findCheapestPlan(productId);
  }

  @Get('tenure/:tenure')
  @ApiOperation({
    summary: 'Get EMI plans by tenure',
    description: 'Filter EMI plans by duration in months',
  })
  @ApiParam({
    name: 'tenure',
    description: 'EMI tenure in months',
    example: 12,
  })
  @ApiResponse({ status: 200, description: 'Plans filtered by tenure' })
  async findByTenure(@Param('tenure') tenure: number) {
    return this.emiPlansService.findByTenure(tenure);
  }

  @Get('zero-interest')
  @ApiOperation({
    summary: 'Get zero-interest EMI plans',
    description: 'Retrieve all EMI plans with 0% interest rate',
  })
  @ApiResponse({ status: 200, description: 'Zero-interest plans retrieved' })
  async findZeroInterest() {
    return this.emiPlansService.findZeroInterestPlans();
  }

  @Get('product/:productId/sorted')
  @ApiOperation({
    summary: 'Get EMI plans sorted by monthly payment',
    description:
      'Retrieve EMI plans for a product sorted by monthly payment amount',
  })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order (asc = lowest first, desc = highest first)',
    example: 'asc',
  })
  @ApiResponse({ status: 200, description: 'Sorted EMI plans retrieved' })
  async findSorted(
    @Param('productId') productId: string,
    @Query('order') order: string = 'asc',
  ) {
    const ascending = order.toLowerCase() === 'asc';
    return this.emiPlansService.findSortedByPayment(productId, ascending);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new EMI plan' })
  @ApiBody({ type: CreateEmiPlanDto })
  @ApiResponse({ status: 201, description: 'EMI plan created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() createEmiPlanDto: CreateEmiPlanDto) {
    return this.emiPlansService.create(createEmiPlanDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update EMI plan' })
  @ApiParam({ name: 'id', description: 'EMI Plan ID' })
  @ApiBody({ type: CreateEmiPlanDto })
  @ApiResponse({ status: 200, description: 'EMI plan updated successfully' })
  @ApiResponse({ status: 404, description: 'EMI plan not found' })
  async update(
    @Param('id') id: string,
    @Body() updateEmiPlanDto: Partial<CreateEmiPlanDto>,
  ) {
    return this.emiPlansService.update(id, updateEmiPlanDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete EMI plan',
    description: 'Remove an EMI plan from the database',
  })
  @ApiParam({ name: 'id', description: 'EMI Plan ID' })
  @ApiResponse({ status: 204, description: 'EMI plan deleted successfully' })
  @ApiResponse({ status: 404, description: 'EMI plan not found' })
  async delete(@Param('id') id: string) {
    await this.emiPlansService.delete(id);
  }
}
