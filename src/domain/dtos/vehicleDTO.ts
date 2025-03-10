import { Vehicle } from '../entities/vehicle';

export class PodracerDTO {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: number;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  vehicle_class: string;
  pilots: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;

  constructor(data: Vehicle) {
    this.name = data.name;
    this.model = data.model;
    this.manufacturer = data.manufacturer;
    this.cost_in_credits = data.cost_in_credits;
    this.length = data.length;
    this.max_atmosphering_speed = this.parseNumber(data.max_atmosphering_speed);
    this.crew = data.crew;
    this.passengers = data.passengers;
    this.cargo_capacity = data.cargo_capacity;
    this.consumables = data.consumables;
    this.vehicle_class = data.vehicle_class;
    this.pilots = data.pilots;
    this.films = data.films;
    this.created = data.created;
    this.edited = data.edited;
    this.url = data.url;
  }

  private parseNumber(value: string): number {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
}
