import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EmiPlanDocument = EmiPlan & Document;

@Schema({
  timestamps: true,
  collection: 'emiplans',
})
export class EmiPlan {
  @Prop({
    type: Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  productId: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  tenure: number; // in months (e.g., 3, 6, 9, 12, 18, 24)

  @Prop({ required: true, min: 0 })
  monthlyPayment: number;

  @Prop({ required: true, min: 0, max: 100 })
  interestRate: number; // percentage (0 for zero interest)

  @Prop({ default: 0, min: 0 })
  processingFee: number;

  @Prop({ default: 0, min: 0 })
  downPayment: number;

  @Prop({ default: 0, min: 0 })
  cashback: number;

  @Prop({ trim: true })
  description: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isRecommended: boolean;
}

export const EmiPlanSchema = SchemaFactory.createForClass(EmiPlan);

// Create indexes for better query performance
EmiPlanSchema.index({ productId: 1 });
EmiPlanSchema.index({ tenure: 1 });
EmiPlanSchema.index({ isActive: 1 });
EmiPlanSchema.index({ productId: 1, tenure: 1 });
