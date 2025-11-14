import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmiPlan, EmiPlanDocument } from '../schemas/emi-plan.schema';
import { CreateEmiPlanDto } from '../dtos/create-emi-plan.dto';
import { Product, ProductDocument } from 'src/schemas/product.schema';

@Injectable()
export class EmiPlansService {
  constructor(
    @InjectModel(EmiPlan.name) private emiPlanModel: Model<EmiPlanDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  // Get all EMI plans
  async findAll(): Promise<EmiPlan[]> {
    return this.emiPlanModel
      .find({ isActive: true })
      .sort({ tenure: 1 })
      .exec();
  }

  // Get EMI plan by ID
  async findById(id: string): Promise<EmiPlan> {
    const emiPlan = await this.emiPlanModel.findById(id).exec();

    if (!emiPlan) {
      throw new NotFoundException(`EMI Plan with ID ${id} not found`);
    }

    return emiPlan;
  }

  // Get all EMI plans for a specific product
  async findByProductId(productId: string): Promise<EmiPlan[]> {
    return this.emiPlanModel
      .find({ productId, isActive: true })
      .sort({ tenure: 1 })
      .exec();
  }

  // Get EMI plans by tenure
  async findByTenure(tenure: number): Promise<EmiPlan[]> {
    return this.emiPlanModel.find({ tenure, isActive: true }).exec();
  }

  // Get zero-interest EMI plans
  async findZeroInterestPlans(): Promise<EmiPlan[]> {
    return this.emiPlanModel
      .find({ interestRate: 0, isActive: true })
      .sort({ tenure: 1 })
      .exec();
  }

  // Get recommended EMI plans for a product
  async findRecommendedByProductId(productId: string): Promise<EmiPlan[]> {
    return this.emiPlanModel
      .find({ productId, isRecommended: true, isActive: true })
      .sort({ tenure: 1 })
      .exec();
  }

  // Create new EMI plan and update product's emiPlans array
  async create(createEmiPlanDto: CreateEmiPlanDto): Promise<EmiPlan> {
    const newEmiPlan = new this.emiPlanModel(createEmiPlanDto);
    const savedEmiPlan = await newEmiPlan.save();

    // Push EMI plan id into product's emiPlans array
    await this.productModel.findByIdAndUpdate(
      createEmiPlanDto.productId,
      { $push: { emiPlans: savedEmiPlan._id } },
      { new: true },
    );

    return savedEmiPlan;
  }

  // Update EMI plan
  async update(
    id: string,
    updateData: Partial<CreateEmiPlanDto>,
  ): Promise<EmiPlan> {
    const updatedEmiPlan = await this.emiPlanModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedEmiPlan) {
      throw new NotFoundException(`EMI Plan with ID ${id} not found`);
    }

    return updatedEmiPlan;
  }

  // Delete EMI plan
  async delete(id: string): Promise<void> {
    const emiPlan = await this.emiPlanModel.findById(id).exec();

    if (!emiPlan) {
      throw new NotFoundException(`EMI Plan with ID ${id} not found`);
    }

    // Remove the plan id from product's emiPlans array
    await this.productModel.findByIdAndUpdate(emiPlan.productId, {
      $pull: { emiPlans: emiPlan._id },
    });

    // Delete the EMI plan itself
    await this.emiPlanModel.findByIdAndDelete(id).exec();
  }

  // Get EMI plans sorted by monthly payment
  async findSortedByPayment(
    productId: string,
    ascending: boolean = true,
  ): Promise<EmiPlan[]> {
    const sortOrder = ascending ? 1 : -1;
    return this.emiPlanModel
      .find({ productId, isActive: true })
      .sort({ monthlyPayment: sortOrder })
      .exec();
  }

  // Get cheapest EMI plan for a product
  async findCheapestPlan(productId: string): Promise<EmiPlan> {
    const plan = await this.emiPlanModel
      .findOne({ productId, isActive: true })
      .sort({ monthlyPayment: 1 })
      .exec();

    if (!plan) {
      throw new NotFoundException(
        `No EMI plans found for product ${productId}`,
      );
    }

    return plan;
  }
}
