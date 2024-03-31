import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './client/clients.module';
import { FinancierModule } from './financier/financier.module';
//import { MailerModule } from '@nestjs-modules/mailer';
import { ParametrageModule } from './parametrage/parametrage.module';
import { ServiceModule } from './service/service.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    UsersModule,
    AuthModule,
    ClientsModule,
    FinancierModule,
    ParametrageModule,
    ServiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
