import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import Schemas
import { Product, ProductSchema } from './schemas/product.schema';
import { Variant, VariantSchema } from './schemas/variant.schema';
import { EmiPlan, EmiPlanSchema } from './schemas/emi-plan.schema';

// Import Services
import { ProductsService } from './services/products.service';
import { VariantsService } from './services/variants.service';
import { EmiPlansService } from './services/emi-plans.service';

// Import Controllers
import { ProductsController } from './controllers/products.controller';
import { VariantsController } from './controllers/variants.controller';
import { EmiPlansController } from './controllers/emi-plans.controller';

@Module({
  imports: [
    // Configuration Module (loads .env file)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // MongoDB Connection with ConfigService
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    // Register all schemas
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Variant.name, schema: VariantSchema },
      { name: EmiPlan.name, schema: EmiPlanSchema },
    ]),
  ],
  controllers: [
    AppController,
    ProductsController,
    VariantsController,
    EmiPlansController,
  ],
  providers: [AppService, ProductsService, VariantsService, EmiPlansService],
})
export class AppModule {}
