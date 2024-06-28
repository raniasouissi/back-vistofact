// create-notification.dto.ts
import { IsEnum, IsMongoId } from 'class-validator';

export class CreateNotifDto {
  @IsEnum([
    'FactureCréée',
    'PaiementRéglé',
    'DevisClientNotif',
    'DevisFinNotif',
  ])
  type: 'FactureCréée' | 'PaiementRéglé' | 'DevisClientNotif' | 'DevisFinNotif';

  notif: string;

  @IsMongoId()
  client: string;
}
