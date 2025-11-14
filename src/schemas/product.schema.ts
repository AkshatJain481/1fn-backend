import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({
  timestamps: true,
  collection: 'products',
})
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  brand: string;

  @Prop({ required: true, lowercase: true, trim: true })
  category: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  basePrice: number;

  @Prop({ required: true, min: 0 })
  mrp: number;

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Variant' }],
    default: [],
  })
  variants: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'EmiPlan' }],
    default: [],
  })
  emiPlans: Types.ObjectId[];

  @Prop({ default: true })
  inStock: boolean;

  @Prop({ type: Object, default: {} })
  specifications: Record<string, any>;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  slug: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
