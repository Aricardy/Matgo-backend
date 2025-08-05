import React from 'react';

interface Vehicle {
  saccoName: string;
  busName: string;
  registrationNumber: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => (
  <div className="vehicle-card">
    <div><strong>Sacco:</strong> {vehicle.saccoName}</div>
    <div><strong>Bus:</strong> {vehicle.busName}</div>
    <div><strong>Reg No:</strong> {vehicle.registrationNumber}</div>
  </div>
);

export default VehicleCard;
