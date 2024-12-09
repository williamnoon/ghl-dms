import { Vehicle } from '../types/inventory';

const NHTSA_API_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles/decodevin';

export async function decodeVIN(vin: string): Promise<Partial<Vehicle>> {
  try {
    const response = await fetch(`${NHTSA_API_URL}/${vin}?format=json`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error('Failed to decode VIN');
    }

    const results = data.Results.reduce((acc: Record<string, string>, item: any) => {
      if (item.Value && item.Value !== 'null') {
        acc[item.Variable] = item.Value;
      }
      return acc;
    }, {});

    return {
      make: results.Make || '',
      model: results.Model || '',
      year: parseInt(results.ModelYear) || new Date().getFullYear(),
      specifications: {
        'Engine Type': results.EngineConfiguration || '',
        'Fuel Type': results.FuelTypePrimary || '',
        'Drive Type': results.DriveType || '',
        'Body Class': results.BodyClass || '',
        'Vehicle Type': results.VehicleType || '',
      }
    };
  } catch (error) {
    console.error('Error decoding VIN:', error);
    throw error;
  }
}