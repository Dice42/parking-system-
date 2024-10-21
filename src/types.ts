export interface ParkingZone {
  id: string;
  name: string;
  capacity: number;
  carsIn: number;
  carsOut: number;
}

export interface LogEntry {
  id: string;
  dateTime: string;
  zoneId: string;
  type: 'In' | 'Out';
  carCount: number;
}