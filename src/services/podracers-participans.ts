import { DriverDTO } from '@/domain/dtos/driverDTO';
import { PodracerDTO } from '@/domain/dtos/vehicleDTO';
import { PeopleSW } from '@/domain/entities/people';
import { Planet } from '@/domain/entities/planet';
import { Participant } from '@/domain/entities/participant';
import axios from 'axios';
import { CacheService } from './cahe-redis';
import { DynamoDBRepository } from '@/repositories/dynamodb';

// URLs de las APIs
const SWAPI_VEHICLES_URL =
  process.env.SWAPI_VEHICLES_URL || 'https://swapi.dev/api/vehicles/';
const OPENF1_DRIVERS_URL =
  process.env.OPENF1_DRIVERS_URL || 'https://api.openf1.org/v1/drivers';
const SWAPI_PEOPLE_URL =
  process.env.SWAPI_PEOPLE_URL || 'https://swapi.dev/api/people';

// 🚀 Función para obtener vehículos de carrera
const getRacingVehicles = async (): Promise<PodracerDTO[]> => {
  try {
    const response = await axios.get<{ results: PodracerDTO[] }>(
      SWAPI_VEHICLES_URL
    );
    const racingV = filterRacingShips(response.data.results);
    console.log('racingV', racingV);
    return response.data.results.filter(
      (vehicle) =>
        vehicle.vehicle_class.toLowerCase().includes('repulsorcraft') ||
        vehicle.max_atmosphering_speed >= 800
    );
  } catch (error) {
    console.error('Error obteniendo vehículos:', error);
    return [];
  }
};

// 🏎️ Función para obtener pilotos de F1
const getF1Drivers = async (): Promise<DriverDTO[]> => {
  try {
    const response = await axios.get<DriverDTO[]>(OPENF1_DRIVERS_URL);
    console.log('Drivers: ', response.data.length);
    const drives = response.data.slice(0, 15); // Tomar solo algunos pilotos
    return drives.map((d) => {
      d.nationality = 'Earth 🌍';
      return d;
    });
  } catch (error) {
    console.error('Error obteniendo pilotos de F1:', error);
    return [];
  }
};

// 🛸 Función para obtener personajes de Star Wars
const getPeopleSW = async (): Promise<DriverDTO[]> => {
  try {
    const response = await axios.get<{ results: PeopleSW[] }>(SWAPI_PEOPLE_URL);
    console.log('PeopleSW ', response.data);
    // Obtener solo los primeros 15 personajes
    const people = response.data.results.slice(0, 15);

    // Obtener la nacionalidad de cada persona de forma concurrente
    const drivers = await Promise.all(
      people.map(async (d) => {
        try {
          const planetResponse = await axios.get<Planet>(d.homeworld);
          d.homeworld = planetResponse.data.name;
        } catch (err) {
          console.warn(`No se pudo obtener el planeta para ${d.name}:`, err);
          d.homeworld = 'Desconocido'; // Fallback en caso de error
        }
        return new DriverDTO(d);
      })
    );

    return drivers;
  } catch (error) {
    console.error('Error obteniendo Jedis:', error);
    return [];
  }
};
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 🏁 Función para fusionar los datos y generar la lista de la carrera
export const generateRaceParticipants = async (): Promise<Participant[]> => {
  const drivers = getF1Drivers();
  const jedis = getPeopleSW();
  const vehicles = await getRacingVehicles();
  const date = Date.now();

  // Unir pilotos de F1 y Jedis en una misma lista
  const allDrivers = [...(await drivers), ...(await jedis)];

  const all: Participant[] = allDrivers.map((driver, index) => {
    const randIndex = getRandomNumber(0, 2);
    console.log('randIndex', randIndex);
    const assignedVehicle = vehicles[randIndex]; // Asignar vehículo de manera cíclica
    return {
      name: driver.full_name,
      vehicle: assignedVehicle ? assignedVehicle.name : 'Speeder genérico',
      planet: driver.nationality,
    };
  });

  await saveToCacheAndDB(String(date), all);

  return all;
};

const filterRacingShips = (ships: PodracerDTO[]): PodracerDTO[] => {
  return ships.filter(
    (ship) =>
      (ship.vehicle_class.toLowerCase().includes('speeder') ||
        ship.vehicle_class.toLowerCase().includes('repulsorcraft')) &&
      ship.max_atmosphering_speed !== undefined &&
      ship.max_atmosphering_speed >= 800
  );
};

// Método reutilizable para guardar en caché y en BD
export const saveToCacheAndDB = async (
  key: string,
  data: Participant[]
): Promise<void> => {
  try {
    await CacheService.setCache(key, data);
    await DynamoDBRepository.saveMergedData(data);
  } catch (error) {
    throw new Error('Error en la fusión de datos - saveToCacheAndDB');
  }
};
