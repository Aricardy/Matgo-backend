#!/bin/bash

# Database credentials from .env
DB_USER="allan"
DB_PASS="Ariam@12345"
DB_NAME="matgo_db"
DB_HOST="127.0.0.1"

# Execute SQL files in order
echo "Seeding passengers..."
mysql -h$DB_HOST -u$DB_USER -p$DB_PASS $DB_NAME < scripts/seed_passengers.sql

echo "Seeding SACCOS and admins..."
mysql -h$DB_HOST -u$DB_USER -p$DB_PASS $DB_NAME < scripts/seed_sacco_admins.sql

echo "Seeding matatus, drivers, and conductors..."
mysql -h$DB_HOST -u$DB_USER -p$DB_PASS $DB_NAME < scripts/seed_matatus_drivers_conductors.sql

echo "Adding admin user..."
mysql -h$DB_HOST -u$DB_USER -p$DB_PASS $DB_NAME < scripts/seed_admin.sql

echo -e "\nDatabase seeding completed successfully!"
echo "Admin login:"
echo "Email: admin@matgo.co.ke"
echo "Password: Admin@12345"
