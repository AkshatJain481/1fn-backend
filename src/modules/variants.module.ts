import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Variant, VariantSchema } from '../schemas/variant.schema';
import { Product, ProductSchema } from '../schemas/product.schema';
import { VariantsService } from '../services/variants.service';
import { VariantsController } from '../controllers/variants.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Variant.name, schema: VariantSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [VariantsController],
  providers: [VariantsService],
  exports: [VariantsService],
})
export class VariantsModule {}
