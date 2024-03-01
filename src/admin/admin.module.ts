import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminsController } from './admin.controller';
import { AdminsService } from './admin.service';
import { Admin, AdminSchema } from './models/admin.models';
//import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
  ],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}
