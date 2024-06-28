import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './client/clients.module';
import { FinancierModule } from './financier/financier.module';
import { ParametrageModule } from './parametrage/parametrage.module';
import { ServiceModule } from './service/service.module';
import { TvaModule } from './tva/tva.module';
import { TimbreModule } from './timbre/timbre.module';
import { CategorieModule } from './categorie/categorie.module';
import { DeviseModule } from './devise/devise.module';
import { FactureModule } from './facture/facture.module';
import { PaiementModule } from './paiement/paiement.module';
import { EcheanceModule } from './echeance/echeance.module';
import { NotificationModule } from './notification/notification.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
    TvaModule,
    TimbreModule,
    CategorieModule,
    DeviseModule,
    FactureModule,
    PaiementModule,
    EcheanceModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
