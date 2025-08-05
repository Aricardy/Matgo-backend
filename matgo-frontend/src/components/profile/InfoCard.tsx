import React from 'react';

interface InfoCardProps {
  phone: string;
  email: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ phone, email }) => (
  <div className="info-card">
    <div><strong>Phone:</strong> {phone}</div>
    <div><strong>Email:</strong> {email}</div>
  </div>
);

export default InfoCard;
