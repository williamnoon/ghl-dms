import React from 'react';
import { format } from 'date-fns';
import { Vehicle } from '../types/inventory';

interface PublicVehicleListProps {
  vehicles: Vehicle[];
}

export function PublicVehicleList({ vehicles }: PublicVehicleListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <div
          key={vehicle.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="aspect-w-16 aspect-h-9 bg-gray-200">
            {vehicle.images[0] ? (
              <img
                src={vehicle.images[0]}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No Image Available
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <div className="mt-2 space-y-2">
              <p className="text-2xl font-bold text-gray-900">
                ${vehicle.price.toLocaleString()}
              </p>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    vehicle.status === 'available'
                      ? 'bg-green-100 text-green-800'
                      : vehicle.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {vehicle.status}
                </span>
                <span className="text-sm text-gray-500 capitalize">
                  {vehicle.condition}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">
                {vehicle.description}
              </p>
              <div className="mt-4 text-sm text-gray-500">
                Last updated: {format(vehicle.updatedAt, 'MMM d, yyyy')}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}