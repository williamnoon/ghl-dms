import { Vehicle, InventoryFilters } from '../types/inventory';

export function filterVehicles(vehicles: Vehicle[], filters: InventoryFilters): Vehicle[] {
  return vehicles.filter((vehicle) => {
    const matchesSearch =
      !filters.search ||
      `${vehicle.make} ${vehicle.model} ${vehicle.year}`
        .toLowerCase()
        .includes(filters.search.toLowerCase());

    const matchesCondition =
      filters.condition.length === 0 ||
      filters.condition.includes(vehicle.condition);

    const matchesStatus =
      filters.status.length === 0 || filters.status.includes(vehicle.status);

    const matchesPrice =
      vehicle.price >= filters.minPrice && vehicle.price <= filters.maxPrice;

    const matchesYear =
      vehicle.year >= filters.minYear && vehicle.year <= filters.maxYear;

    return (
      matchesSearch &&
      matchesCondition &&
      matchesStatus &&
      matchesPrice &&
      matchesYear
    );
  });
}