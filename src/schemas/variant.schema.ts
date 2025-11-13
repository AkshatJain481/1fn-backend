import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VariantDocument = Variant & Document;

@Schema({
  timestamps: true,
  collection: 'variants',
})
export class Variant {
  @Prop({
    type: Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  productId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  storage: string; // e.g., "128GB", "256GB", "512GB"

  @Prop({ required: true, trim: true })
  color: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0 })
  mrp: number;

  @Prop({ default: true })
  inStock: boolean;

  @Prop({ default: 0, min: 0 })
  stockQuantity: number;

  @Prop({ unique: true, sparse: true, uppercase: true, trim: true })
  sku: string;
}

export const VariantSchema = SchemaFactory.createForClass(Variant);

// Create indexes for better query performance
VariantSchema.index({ productId: 1 });
VariantSchema.index({ sku: 1 });
VariantSchema.index({ storage: 1, color: 1 });
