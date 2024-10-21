import React, { useState, useEffect } from 'react';
import { ParkingZone, LogEntry } from './types';
import ZoneTable from './components/ZoneTable';
import LogForm from './components/LogForm';
import AddZoneForm from './components/AddZoneForm';
import { PlusCircle } from 'lucide-react';

const App: React.FC = () => {
  const [parkingZones, setParkingZones] = useState<ParkingZone[]>([]);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [showAddZoneForm, setShowAddZoneForm] = useState(false);

  useEffect(() => {
    fetchSheetData();
  }, []);

  useEffect(() => {
    localStorage.setItem('parkingZones', JSON.stringify(parkingZones));
    localStorage.setItem('logEntries', JSON.stringify(logEntries));
  }, [parkingZones, logEntries]);

  const idMapping: { [key: string]: { carsIn: string; carsOut: string; capacity: string; availableSpace: string } } = {
    Red_1: { carsIn: 'C2', carsOut: 'D2', capacity: 'B2', availableSpace: 'E2' },
    Red_2: { carsIn: 'C3', carsOut: 'D3', capacity: 'B3', availableSpace: 'E3' },
    Red_3: { carsIn: 'C4', carsOut: 'D4', capacity: 'B4', availableSpace: 'E4' },
    Red_4: { carsIn: 'C5', carsOut: 'D5', capacity: 'B5', availableSpace: 'E5' },
    Red_5: { carsIn: 'C6', carsOut: 'D6', capacity: 'B6', availableSpace: 'E6' },
    Red_6: { carsIn: 'C7', carsOut: 'D7', capacity: 'B7', availableSpace: 'E7' },
    Red_7: { carsIn: 'C8', carsOut: 'D8', capacity: 'B8', availableSpace: 'E8' },
    VDA: { carsIn: 'C9', carsOut: 'D9', capacity: 'B9', availableSpace: 'E9' },
    Gold_1: { carsIn: 'C10', carsOut: 'D10', capacity: 'B10', availableSpace: 'E10' },
    Gold_2: { carsIn: 'C11', carsOut: 'D11', capacity: 'B11', availableSpace: 'E11' },
    Gold_3: { carsIn: 'C12', carsOut: 'D12', capacity: 'B12', availableSpace: 'E12' },
    Gold_4: { carsIn: 'C13', carsOut: 'D13', capacity: 'B13', availableSpace: 'E13' },
    Gold_5: { carsIn: 'C14', carsOut: 'D14', capacity: 'B14', availableSpace: 'E14' },
    Gold_6: { carsIn: 'C15', carsOut: 'D15', capacity: 'B15', availableSpace: 'E15' },
    Silver1: { carsIn: 'C16', carsOut: 'D16', capacity: 'B16', availableSpace: 'E16' },
    Silver2: { carsIn: 'C17', carsOut: 'D17', capacity: 'B17', availableSpace: 'E17' },
    C37_staff: { carsIn: 'C18', carsOut: 'D18', capacity: 'B18', availableSpace: 'E18' },
    EMSO: { carsIn: 'C19', carsOut: 'D19', capacity: 'B19', availableSpace: 'E19' },
    YAM: { carsIn: 'C20', carsOut: 'D20', capacity: 'B20', availableSpace: 'E20' },
    Dutch_Group: { carsIn: 'C21', carsOut: 'D21', capacity: 'B21', availableSpace: 'E21' },
    Multi_Story: { carsIn: 'C22', carsOut: 'D22', capacity: 'B22', availableSpace: 'E22' },
  };

  const fetchSheetData = async () => {
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbwhtbSYlSYopTfPVJR4yd2vFXSg4cKFKffzGMq5AxfR4omqpAaiZyHz7BvLjkFREZsw/exec');
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      const fetchedZones = data.slice(1).map((item: any) => ({
        id: item[0],
        name: item[0],
        capacity: Number(item[1]),
        carsIn: Number.isFinite(item[2]) ? Number(item[2]) : 0,
        carsOut: Number.isFinite(item[3]) ? Number(item[3]) : 0,
        availableSpace: Number.isFinite(item[4]) ? Number(item[4]) : 0,
      }));

      console.log('Fetched Zones:', fetchedZones);
      setParkingZones(fetchedZones);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogSubmit = async (entry: Omit<LogEntry, 'id' | 'dateTime'>) => {
    const newEntry: LogEntry = {
      ...entry,
      id: entry.zoneId,
      dateTime: new Date().toISOString(),
    };

    setLogEntries((prevEntries) => [...prevEntries, newEntry]);

    const updatedZones = parkingZones.map((zone) => {
      if (zone.name === entry.zoneId) {
        return {
          ...zone,
          carsIn: entry.type === 'In' ? zone.carsIn + entry.carCount : zone.carsIn,
          carsOut: entry.type === 'Out' ? zone.carsOut + entry.carCount : zone.carsOut,
        };
      }
      return zone;
    });

    setParkingZones(updatedZones);

    const { carsIn, carsOut, capacity, availableSpace } = idMapping[entry.zoneId];
    const totalCars = updatedZones.find((zone) => zone.name === entry.zoneId)?.carsIn || 0;
    const carsOutCount = updatedZones.find((zone) => zone.name === entry.zoneId)?.carsOut || 0;
    const totalCapacity = updatedZones.find((zone) => zone.name === entry.zoneId)?.capacity || 100;

    let newAvailableSpace = 0;
    if ((totalCapacity - (totalCars - carsOutCount)) > totalCapacity)
      newAvailableSpace = totalCapacity;
    else
      newAvailableSpace = totalCapacity - (totalCars - carsOutCount);
    if (newAvailableSpace < 0)
        newAvailableSpace = totalCapacity;

       
    try {
      console.log('Sending data to Google Sheets:', {
        zoneId: entry.zoneId,
        carsIn: updatedZones.find((zone) => zone.name === entry.zoneId)?.carsIn,
        carsOut: updatedZones.find((zone) => zone.name === entry.zoneId)?.carsOut,
        capacity: totalCapacity,
        availableSpace: newAvailableSpace,
      });

      const dataToSend = {
        carsInCell: carsIn,
        carsOutCell: carsOut,
        capacityCell: capacity,
        availableSpaceCell: availableSpace,
        carsIn: totalCars,
        carsOut: carsOutCount,
        capacity: totalCapacity,
        availableSpace: newAvailableSpace,
      };

      const response = await fetch('https://script.google.com/macros/s/AKfycbwhtbSYlSYopTfPVJR4yd2vFXSg4cKFKffzGMq5AxfR4omqpAaiZyHz7BvLjkFREZsw/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
        mode: 'no-cors',
      });

      const result = await response.json(); // Note: If mode is 'no-cors', you won't be able to read the response.
      if (!result.success) {
        console.error('Failed to update Google Sheet:', result.message || result.error);
      } else {
        console.log('Successfully updated Google Sheet:', result);
      }
    } catch (error) {
      console.error('Error updating Google Sheet:', error);
    }
  };

  const handleAddZone = (newZone: Omit<ParkingZone, 'id'>) => {
    const zoneWithId: ParkingZone = {
      ...newZone,
      id: newZone.name,
      carsIn: 0,
      carsOut: 0,
    };
    setParkingZones((prevZones) => [...prevZones, zoneWithId]);
    setShowAddZoneForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Parking Zone Management System</h1>
      <div className="max-w-4xl mx-auto">
        <ZoneTable zones={parkingZones} />
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Log Cars</h2>
          <LogForm zones={parkingZones} onSubmit={handleLogSubmit} />
        </div>
        <div className="mt-8">
          <button
            className="flex items-center justify-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setShowAddZoneForm(true)}
          >
            <PlusCircle className="mr-2" size={20} />
            Add New Zone
          </button>
        </div>
        {showAddZoneForm && (
          <div className="mt-4">
            <AddZoneForm onSubmit={handleAddZone} onCancel={() => setShowAddZoneForm(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
