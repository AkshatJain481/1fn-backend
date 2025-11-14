import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Variant, VariantDocument } from '../schemas/variant.schema';
import { CreateVariantDto } from '../dtos/create-variant.dto';
import { Product, ProductDocument } from 'src/schemas/product.schema';

@Injectable()
export class VariantsService {
  constructor(
    @InjectModel(Variant.name) private variantModel: Model<VariantDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
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

  // Create new variant and update product's variants array
  async create(createVariantDto: CreateVariantDto): Promise<Variant> {
    const newVariant = new this.variantModel(createVariantDto);
    const savedVariant = await newVariant.save();
    await this.productModel.findByIdAndUpdate(
      createVariantDto.productId,
      { $push: { variants: savedVariant._id } },
      { new: true },
    );
    return savedVariant;
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

  async delete(id: string): Promise<void> {
    // Find the variant first to get productId
    const variant = await this.variantModel.findById(id).exec();

    if (!variant) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }

    // Remove the variant ID from the corresponding product's variants array
    await this.productModel.findByIdAndUpdate(variant.productId, {
      $pull: { variants: variant._id },
    });

    // Delete the variant itself
    await this.variantModel.findByIdAndDelete(id).exec();
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
