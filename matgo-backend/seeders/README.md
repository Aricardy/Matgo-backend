# Matgo Database Seeding

This directory contains scripts to populate the Matgo database with sample data as specified in the `Matgo db.txt` document.

## Overview

The seeding process adds:
- 6 passengers with complete profiles
- 4 sacco admins (transport companies)
- 4 routes (Ngong, Rongai, Kasarani, Embakasi)
- 37 buses with their assigned drivers and conductors
- Comprehensive pricing information for all routes

## Files

- `seedDatabase.js` - Seeds passengers, sacco admins, routes, and buses
- `seedDriversConductors.js` - Seeds drivers and conductors for all buses
- `seedPricing.js` - Seeds pricing information for all routes and saccos
- `runSeeder.js` - Main script that runs all seeders in order

## Usage

### Prerequisites

1. Ensure your database is running (MySQL/MariaDB)
2. Update your `.env` file with correct database credentials:
   ```
   DB_NAME=your_database_name
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_HOST=localhost
   ```

### Running the Seeder

From the `matgo-backend` directory, run:

```bash
node seeders/runSeeder.js
```

Or using npm script (add to package.json):
```bash
npm run seed
```

## Data Structure

### Passengers (6 users)
- Laurine Onana (onanalaurine4@gmail.com)
- Ariam Nyariana (ariamnyariana2@gmail.com)
- Allan Kimani (allan.wachuka@strathmore.edu)
- Alice Wanjiru (alicewanjiru@gmail.com)
- Ariam Kimani (ariamkim1@gmail.com)
- Kim Kimani (kimkimani@gmail.com)

### Sacco Admins (4 companies)
1. **NTVRS** - Operates Ngong and Rongai routes
2. **SuperMetro** - Operates Rongai and Ngong routes
3. **Expresso** - Operates Kasarani, Ngong and Rongai routes
4. **Embasava** - Operates Embakasi route

### Fleet Data
- **Ngong Route**: 18 buses (12 NTVRS + 6 SuperMetro)
- **Rongai Route**: 9 buses (4 Expresso + 5 SuperMetro)
- **Kasarani Route**: 4 Expresso buses
- **Embakasi Route**: 7 Embasava buses

### Pricing Structure
- **Ngong**: Variable pricing (50-150 KSh) based on time and route
- **Rongai**: 100 KSh standard, 150 KSh southern bypass
- **Kasarani**: 60 KSh flat rate
- **Embakasi**: 100 KSh flat rate

## Image Assets

The seeder references image files that should be placed in:
- User avatars: `matgo-backend/public/images/avatars/`
- Bus images: `matgo-backend/public/images/buses/`
- Sacco logos: `matgo-backend/public/images/saccos/`

### Required Images

#### User Avatars (.jpg)
- laurine.jpg, Ariam.jpg, Allan.jpg, Alice.jpg, Ariamkim.jpg, Kim.jpg
- Driver avatars: [driver_name].jpg
- Conductor avatars: [conductor_name].jpg

#### Sacco Logos (.png)
- NTVRS.png, Super Metro.png, Expresso.png, Embasava.png

#### Bus Images (.jpg)
- Named after bus identifier (e.g., X-Rated.jpg, fleet 1456.jpg)

## Notes

- All passwords are hashed using bcrypt
- Default password for drivers/conductors: `Driver@123`
- All users are pre-approved (`approved: true`)
- Phone numbers are auto-generated for drivers/conductors
- License numbers are auto-generated for drivers

## Troubleshooting

1. **Database Connection Error**: Check your `.env` file and ensure database is running
2. **Table Not Found**: Run `npm run migrate` or ensure models are properly synced
3. **Duplicate Entry Error**: Clear existing data or use `force: true` in sync options
4. **Image Not Found**: Ensure image files are in correct directories

## Safety

- The seeder uses `alter: true` to modify existing tables safely
- To completely reset database, uncomment `force: true` in seedDatabase.js
- Always backup your database before running seeders in production