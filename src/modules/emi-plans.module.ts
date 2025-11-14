import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EmiPlan, EmiPlanSchema } from '../schemas/emi-plan.schema';
import { Product, ProductSchema } from '../schemas/product.schema';
import { EmiPlansService } from '../services/emi-plans.service';
import { EmiPlansController } from '../controllers/emi-plans.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmiPlan.name, schema: EmiPlanSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [EmiPlansController],
  providers: [EmiPlansService],
  exports: [EmiPlansService],
})
export class EmiPlansModule {}
