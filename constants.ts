
import { VehicleType, RoadType, AccidentHotspot, StatisticsData } from './types';

export const MALAYSIA_BOUNDS = {
  lat: 4.2105,
  lng: 101.9758,
  zoom: 6
};

// Mock initial data to ensure the dashboard looks good immediately
export const INITIAL_HOTSPOTS: AccidentHotspot[] = [
  { id: '1', name: 'Federal Highway (KL-Klang)', latitude: 3.08, longitude: 101.58, fatalities: 45, vehicleTypes: [VehicleType.CAR, VehicleType.MOTORCYCLE], roadType: RoadType.FEDERAL_ROAD, year: 2024 },
  { id: '2', name: 'PLUS Highway (Seremban - KL)', latitude: 2.85, longitude: 101.82, fatalities: 32, vehicleTypes: [VehicleType.CAR, VehicleType.LORRY], roadType: RoadType.TOLL_HIGHWAY, year: 2024 },
  { id: '3', name: 'LDP (Damansara-Puchong)', latitude: 3.12, longitude: 101.62, fatalities: 18, vehicleTypes: [VehicleType.CAR, VehicleType.MOTORCYCLE], roadType: RoadType.TOLL_HIGHWAY, year: 2024 },
  { id: '4', name: 'Karak Highway', latitude: 3.32, longitude: 101.92, fatalities: 28, vehicleTypes: [VehicleType.CAR, VehicleType.BUS], roadType: RoadType.TOLL_HIGHWAY, year: 2024 },
  { id: '5', name: 'Penang Bridge', latitude: 5.35, longitude: 100.35, fatalities: 12, vehicleTypes: [VehicleType.MOTORCYCLE, VehicleType.CAR], roadType: RoadType.TOLL_HIGHWAY, year: 2024 },
  { id: '1b', name: 'Federal Highway (KL-Klang)', latitude: 3.08, longitude: 101.58, fatalities: 42, vehicleTypes: [VehicleType.CAR, VehicleType.MOTORCYCLE], roadType: RoadType.FEDERAL_ROAD, year: 2023 },
  { id: '2b', name: 'PLUS Highway (Seremban - KL)', latitude: 2.85, longitude: 101.82, fatalities: 28, vehicleTypes: [VehicleType.CAR, VehicleType.LORRY], roadType: RoadType.TOLL_HIGHWAY, year: 2023 },
  { id: '6', name: 'Jalan Tuaran, Kota Kinabalu', latitude: 5.98, longitude: 116.12, fatalities: 15, vehicleTypes: [VehicleType.CAR], roadType: RoadType.STATE_ROAD, year: 2024 },
  { id: '7', name: 'Lebuhraya Pan Borneo', latitude: 4.41, longitude: 113.98, fatalities: 22, vehicleTypes: [VehicleType.LORRY, VehicleType.CAR], roadType: RoadType.FEDERAL_ROAD, year: 2024 },
  { id: '8', name: 'Jalan Kuching, KL', latitude: 3.16, longitude: 101.68, fatalities: 19, vehicleTypes: [VehicleType.MOTORCYCLE], roadType: RoadType.MUNICIPAL_ROAD, year: 2023 },
];

export const INITIAL_STATS: StatisticsData = {
  weekly: [
    { name: 'Mon', value: 12 }, { name: 'Tue', value: 19 }, { name: 'Wed', value: 15 },
    { name: 'Thu', value: 22 }, { name: 'Fri', value: 30 }, { name: 'Sat', value: 45 }, { name: 'Sun', value: 38 }
  ],
  monthly: [
    { name: 'Jan', value: 420 }, { name: 'Feb', value: 380 }, { name: 'Mar', value: 450 },
    { name: 'Apr', value: 510 }, { name: 'May', value: 490 }, { name: 'Jun', value: 460 },
    { name: 'Jul', value: 480 }, { name: 'Aug', value: 530 }, { name: 'Sep', value: 470 },
    { name: 'Oct', value: 500 }, { name: 'Nov', value: 550 }, { name: 'Dec', value: 620 }
  ],
  annual: [
    { name: '2020', value: 4634 }, { name: '2021', value: 4539 }, { name: '2022', value: 5671 }, { name: '2023', value: 6031 }, { name: '2024', value: 6215 }
  ],
  byVehicle: [
    { name: 'Motorcycle', value: 65 }, { name: 'Car', value: 20 },
    { name: 'Lorry', value: 8 }, { name: 'Others', value: 7 }
  ],
  byRoad: [
    { name: 'Federal', value: 40 }, { name: 'State', value: 30 },
    { name: 'Toll', value: 15 }, { name: 'Municipal', value: 15 }
  ]
};
