import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { Variant, VariantDocument } from '../schemas/variant.schema';
import { EmiPlan, EmiPlanDocument } from '../schemas/emi-plan.schema';
import { CreateProductDto } from '../dtos/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Variant.name) private variantModel: Model<VariantDocument>,
    @InjectModel(EmiPlan.name) private emiPlanModel: Model<EmiPlanDocument>,
  ) {}

  // Get all products
  async findAll(): Promise<Product[]> {
    return this.productModel
      .find()
      .populate('variants')
      .populate('emiPlans')
      .exec();
  }

  // Get product by ID
  async findById(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('variants')
      .populate('emiPlans')
      .exec();

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  // Get product by slug
  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productModel
      .findOne({ slug })
      .populate('variants')
      .populate('emiPlans')
      .exec();

    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }

    return product;
  }

  // Create new product
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = new this.productModel(createProductDto);
    return newProduct.save();
  }

  // Update product
  async update(
    id: string,
    updateData: Partial<CreateProductDto>,
  ): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('variants')
      .populate('emiPlans')
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return updatedProduct;
  }

  // Delete product
  async delete(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Also delete associated variants and EMI plans
    await this.variantModel.deleteMany({ productId: id }).exec();
    await this.emiPlanModel.deleteMany({ productId: id }).exec();
  }

  // Get products by category
  async findByCategory(category: string): Promise<Product[]> {
    return this.productModel
      .find({ category: category.toLowerCase() })
      .populate('variants')
      .populate('emiPlans')
      .exec();
  }

  // Search products
  async search(query: string): Promise<Product[]> {
    return this.productModel
      .find({ $text: { $search: query } })
      .populate('variants')
      .populate('emiPlans')
      .exec();
  }
}
