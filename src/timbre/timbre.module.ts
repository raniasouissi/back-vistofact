import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimbreController } from './timbre.controller';
import { TimbreService } from './timbre.service';
import { Timbre, TimbreSchema } from './models/timbre.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Timbre.name, schema: TimbreSchema }]),
  ],
  controllers: [TimbreController],
  providers: [TimbreService],
})
export class TimbreModule {}
