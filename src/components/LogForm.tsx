import React, { useState } from 'react';
import { ParkingZone } from '../types';

interface LogFormProps {
  zones: ParkingZone[];
  onSubmit: (entry: { zoneId: string; type: 'In' | 'Out'; carCount: number }) => void;
}

const LogForm: React.FC<LogFormProps> = ({ zones, onSubmit }) => {
  const [zoneId, setZoneId] = useState('');
  const [carCount, setCarCount] = useState(1);

  const handleSubmit = (type: 'In' | 'Out') => (e: React.FormEvent) => {
    e.preventDefault();
    if (zoneId && carCount > 0) {
      onSubmit({ zoneId, type, carCount });
      setCarCount(1);
    }
  };

  return (
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="zone">
          Zone
        </label>
        <select
          id="zone"
          value={zoneId}
          onChange={(e) => setZoneId(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Select a zone</option>
          {zones.map((zone) => (
            <option key={zone.id} value={zone.id}>
              {zone.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="carCount">
          Car Count
        </label>
        <input
          id="carCount"
          type="number"
          min="1"
          value={carCount}
          onChange={(e) => setCarCount(parseInt(e.target.value))}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          onClick={handleSubmit('In')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cars In
        </button>
        <button
          type="submit"
          onClick={handleSubmit('Out')}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cars Out
        </button>
      </div>
    </form>
  );
};

export default LogForm;