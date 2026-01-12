
export enum VehicleType {
  MOTORCYCLE = 'Motorcycle',
  CAR = 'Car',
  VAN = 'Van',
  BUS = 'Bus',
  LORRY = 'Lorry',
  BICYCLE = 'Bicycle',
  OTHERS = 'Others'
}

export enum RoadType {
  TOLL_HIGHWAY = 'Toll Highway',
  FEDERAL_ROAD = 'Federal Road',
  STATE_ROAD = 'State Road',
  MUNICIPAL_ROAD = 'Municipal Road'
}

export interface AccidentHotspot {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  fatalities: number;
  vehicleTypes: VehicleType[];
  roadType: RoadType;
  year: number;
}

export interface StatisticsData {
  weekly: { name: string; value: number }[];
  monthly: { name: string; value: number }[];
  annual: { name: string; value: number }[];
  byVehicle: { name: string; value: number }[];
  byRoad: { name: string; value: number }[];
}

export interface DashboardState {
  hotspots: AccidentHotspot[];
  stats: StatisticsData;
  isLoading: boolean;
  lastUpdated: string | null;
  groundingSources: { title: string; uri: string }[];
}
