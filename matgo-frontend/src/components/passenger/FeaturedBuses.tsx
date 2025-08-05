import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FeaturedBuses = () => {
  const [buses, setBuses] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/promotions/featured').then(res => setBuses(res.data));
  }, []);

  return (
    <div className="featured-buses" style={{ display: 'flex', gap: 16 }}>
      {buses.slice(0, 3).map(bus => (
        <div key={bus.id} className="bus-card" style={{ flex: 1 }}>
          <img src={bus.bus_image_url} alt={bus.fleet_name} style={{ width: '100%' }} />
          <div>{bus.fleet_name || bus.fleet_number}</div>
          <div>{bus.route_name}</div>
          <div className="hover-details" style={{ display: 'none' }}>
            <div>Sacco: {bus.sacco_name}</div>
            <div>Driver: {bus.driver_name}</div>
            <div>Conductor: {bus.conductor_name}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedBuses;
