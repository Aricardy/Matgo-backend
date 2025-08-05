import React from 'react';

interface PerformanceCardProps {
  rating: number;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({ rating }) => (
  <div className="performance-card">
    <span>Performance:</span>
    <span style={{ fontWeight: 'bold', marginLeft: 8 }}>{rating.toFixed(1)} / 5 ⭐</span>
  </div>
);

export default PerformanceCard;
