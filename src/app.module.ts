import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ProductsModule } from './modules/products.module';
import { VariantsModule } from './modules/variants.module';
import { EmiPlansModule } from './modules/emi-plans.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ProductsModule,
    VariantsModule,
    EmiPlansModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
