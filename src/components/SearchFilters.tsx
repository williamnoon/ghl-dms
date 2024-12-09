import React from 'react';
import { InventoryFilters } from '../types/inventory';
import { Search } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';

interface SearchFiltersProps {
  filters: InventoryFilters;
  onFilterChange: (filters: Partial<InventoryFilters>) => void;
}

export function SearchFilters({ filters, onFilterChange }: SearchFiltersProps) {
  const { vehicles } = useInventoryStore();

  // Get unique values from actual inventory
  const uniqueConditions = Array.from(new Set(vehicles.map(v => v.condition)));
  const uniqueStatuses = Array.from(new Set(vehicles.map(v => v.status)));
  const priceRange = vehicles.reduce((acc, v) => ({
    min: Math.min(acc.min, v.price),
    max: Math.max(acc.max, v.price)
  }), { min: Infinity, max: -Infinity });
  const yearRange = vehicles.reduce((acc, v) => ({
    min: Math.min(acc.min, v.year),
    max: Math.max(acc.max, v.year)
  }), { min: Infinity, max: -Infinity });

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search vehicles..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {uniqueConditions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <div className="space-y-2">
                {uniqueConditions.map((condition) => (
                  <label key={condition} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.condition.includes(condition)}
                      onChange={(e) => {
                        const newConditions = e.target.checked
                          ? [...filters.condition, condition]
                          : filters.condition.filter((c) => c !== condition);
                        onFilterChange({ condition: newConditions });
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600 capitalize">
                      {condition}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {uniqueStatuses.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="space-y-2">
                {uniqueStatuses.map((status) => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={(e) => {
                        const newStatus = e.target.checked
                          ? [...filters.status, status]
                          : filters.status.filter((s) => s !== status);
                        onFilterChange({ status: newStatus });
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600 capitalize">
                      {status}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {vehicles.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <div className="space-y-2">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) =>
                    onFilterChange({ minPrice: parseInt(e.target.value) || priceRange.min })
                  }
                  min={priceRange.min}
                  max={priceRange.max}
                  placeholder="Min Price"
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    onFilterChange({ maxPrice: parseInt(e.target.value) || priceRange.max })
                  }
                  min={priceRange.min}
                  max={priceRange.max}
                  placeholder="Max Price"
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {vehicles.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year Range
              </label>
              <div className="space-y-2">
                <input
                  type="number"
                  value={filters.minYear}
                  onChange={(e) =>
                    onFilterChange({ minYear: parseInt(e.target.value) || yearRange.min })
                  }
                  min={yearRange.min}
                  max={yearRange.max}
                  placeholder="Min Year"
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  value={filters.maxYear}
                  onChange={(e) =>
                    onFilterChange({ maxYear: parseInt(e.target.value) || yearRange.max })
                  }
                  min={yearRange.min}
                  max={yearRange.max}
                  placeholder="Max Year"
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}