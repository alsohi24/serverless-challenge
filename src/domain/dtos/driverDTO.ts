import { Driver } from '../entities/drive';
import { PeopleSW } from '../entities/people';

export class DriverDTO {
  full_name: string;
  nationality: string;

  constructor(data: Driver | PeopleSW) {
    console.log(data);
    if ('full_name' in data && 'nationality' in data) {
      // Si ya es un Driver, lo asignamos directamente
      this.full_name = data.full_name;
      this.nationality = data.nationality;
    } else if ('homeworld' in data) {
      this.full_name = data.name;
      this.nationality = data.homeworld;
    } else {
      // Valores por defecto en caso de datos incompletos
      this.full_name = 'Unknown';
      this.nationality = 'Unknown';
    }
  }
}
