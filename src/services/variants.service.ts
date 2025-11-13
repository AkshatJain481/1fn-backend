import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Variant, VariantDocument } from '../schemas/variant.schema';
import { CreateVariantDto } from '../dtos/create-variant.dto';

@Injectable()
export class VariantsService {
  constructor(
    @InjectModel(Variant.name) private variantModel: Model<VariantDocument>,
  ) {}

  // Get all variants
  async findAll(): Promise<Variant[]> {
    return this.variantModel.find().exec();
  }

  // Get variant by ID
  async findById(id: string): Promise<Variant> {
    const variant = await this.variantModel.findById(id).exec();

    if (!variant) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }

    return variant;
  }

  // Get all variants for a specific product
  async findByProductId(productId: string): Promise<Variant[]> {
    return this.variantModel.find({ productId }).exec();
  }

  // Create new variant
  async create(createVariantDto: CreateVariantDto): Promise<Variant> {
    const newVariant = new this.variantModel(createVariantDto);
    return newVariant.save();
  }

  // Update variant
  async update(
    id: string,
    updateData: Partial<CreateVariantDto>,
  ): Promise<Variant> {
    const updatedVariant = await this.variantModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedVariant) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }

    return updatedVariant;
  }

  // Delete variant
  async delete(id: string): Promise<void> {
    const result = await this.variantModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }
  }

  // Get variants by color
  async findByColor(color: string): Promise<Variant[]> {
    return this.variantModel.find({ color }).exec();
  }

  // Get variants by storage
  async findByStorage(storage: string): Promise<Variant[]> {
    return this.variantModel.find({ storage }).exec();
  }

  // Check if variant is in stock
  async checkStock(id: string): Promise<boolean> {
    const variant = await this.findById(id);
    return variant.inStock && variant.stockQuantity > 0;
  }
}
