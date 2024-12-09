import { Vehicle } from '../types/inventory';

export const sampleVehicles: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    make: 'Toyota',
    model: 'RAV4',
    year: 2024,
    price: 32999,
    condition: 'new',
    status: 'available',
    description: 'Brand new Toyota RAV4 with Toyota Safety Sense 2.5, AWD, and premium audio system.',
    specifications: {
      'Engine': '2.5L 4-Cylinder',
      'Transmission': '8-Speed Automatic',
      'Drivetrain': 'All-Wheel Drive',
      'Fuel Economy': '27 city / 35 highway',
      'Interior': 'Black SofTex®',
      'Exterior': 'Blueprint'
    },
    images: ['https://images.unsplash.com/photo-1581540222194-0def2dda95b8']
  },
  {
    make: 'Tesla',
    model: 'Model Y',
    year: 2024,
    price: 45990,
    condition: 'new',
    status: 'available',
    description: 'All-electric SUV with advanced Autopilot, premium interior, and impressive range.',
    specifications: {
      'Range': '330 miles',
      'Acceleration': '0-60 mph in 4.8s',
      'Drive': 'Dual Motor AWD',
      'Top Speed': '135 mph',
      'Interior': 'White Vegan Leather',
      'Exterior': 'Pearl White'
    },
    images: ['https://images.unsplash.com/photo-1619317554478-c3a56acd2b45']
  },
  {
    make: 'Ford',
    model: 'F-150 Lightning',
    year: 2023,
    price: 55000,
    condition: 'certified',
    status: 'available',
    description: 'Electric pickup truck with extended range battery and Pro Power Onboard.',
    specifications: {
      'Range': '320 miles',
      'Power': '580 hp',
      'Towing': '10,000 lbs',
      'Payload': '2,000 lbs',
      'Interior': 'Black Leather',
      'Exterior': 'Antimatter Blue'
    },
    images: ['https://images.unsplash.com/photo-1675950087025-908c2fb2dd88']
  }
];