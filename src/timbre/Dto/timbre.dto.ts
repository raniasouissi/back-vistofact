//import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTimbreDto {
  value: number;
  readonly status?: boolean = true;
}

export class UpdateTimbreDto {
  value: number;
  readonly status?: boolean = true;
}
