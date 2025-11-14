import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Product, ProductSchema } from '../schemas/product.schema';
import { ProductsService } from '../services/products.service';
import { ProductsController } from '../controllers/products.controller';
import { Variant, VariantSchema } from 'src/schemas/variant.schema';
import { EmiPlan, EmiPlanSchema } from 'src/schemas/emi-plan.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Variant.name, schema: VariantSchema },
      { name: EmiPlan.name, schema: EmiPlanSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
