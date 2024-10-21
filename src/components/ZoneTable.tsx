import React from 'react';
import { ParkingZone } from '../types';

interface ZoneTableProps {
  zones: ParkingZone[];
}

const ZoneTable: React.FC<ZoneTableProps> = ({ zones }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone Name</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cars In</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cars Out</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available Spaces</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {zones.map((zone) => {
            const availableSpaces = zone.capacity - (zone.carsIn - zone.carsOut);
            const occupancyPercentage = ((zone.carsIn - zone.carsOut) / zone.capacity) * 100;
            return (
              <tr key={zone.id}>
                <td className="px-4 py-2 whitespace-nowrap">{zone.name}</td>
                <td className="px-4 py-2 whitespace-nowrap">{zone.capacity}</td>
                <td className="px-4 py-2 whitespace-nowrap">{zone.carsIn}</td>
                <td className="px-4 py-2 whitespace-nowrap">{zone.carsOut}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className={`font-semibold ${availableSpaces < 10 ? 'text-red-600' : 'text-green-600'}`}>
                    {availableSpaces}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${occupancyPercentage}%` }}
                    ></div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ZoneTable;