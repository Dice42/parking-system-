import React, { useState } from 'react';
import { ParkingZone } from '../types';

interface AddZoneFormProps {
  onSubmit: (newZone: Omit<ParkingZone, 'id' | 'carsIn' | 'carsOut'>) => void;
  onCancel: () => void;
}

const AddZoneForm: React.FC<AddZoneFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState(100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && capacity > 0) {
      onSubmit({ name, capacity });
      setName('');
      setCapacity(100);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="zoneName">
          Zone Name
        </label>
        <input
          id="zoneName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="capacity">
          Capacity
        </label>
        <input
          id="capacity"
          type="number"
          min="1"
          value={capacity}
          onChange={(e) => setCapacity(parseInt(e.target.value))}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Zone
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddZoneForm;