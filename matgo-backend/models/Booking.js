
import db from '../config/db.js';

class Booking {
  static async findById(id) {
    const [rows] = await db.query(
      `SELECT b.*, 
        u.fullName as passengerName,
        t.origin as tripOrigin,
        t.destination as tripDestination,
        t.departureTime as tripDepartureTime
      FROM Bookings b
      LEFT JOIN Users u ON b.passengerId = u.id
      LEFT JOIN Trips t ON b.tripId = t.id
      WHERE b.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async create(bookingData) {
    const {
      passengerId,
      tripId,
      route,
      date,
      time,
      seats,
      totalPrice,
      passengers,
      paymentMethod,
      sacco,
      tripType,
      seatsBooked = 1,
      paid = false,
      status = 'pending'
    } = bookingData;

    const [result] = await db.query(
      `INSERT INTO Bookings (
        passengerId, tripId, route, date, time,
        seats, totalPrice, passengers, paymentMethod,
        sacco, tripType, seatsBooked, paid, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        passengerId,
        tripId,
        route,
        date,
        time,
        JSON.stringify(seats),
        totalPrice,
        JSON.stringify(passengers),
        paymentMethod,
        sacco,
        tripType,
        seatsBooked,
        paid,
        status
      ]
    );
    return { id: result.insertId, ...bookingData };
  }

  static async update(id, updateData) {
    // Handle JSON fields
    if (updateData.seats) {
      updateData.seats = JSON.stringify(updateData.seats);
    }
    if (updateData.passengers) {
      updateData.passengers = JSON.stringify(updateData.passengers);
    }

    const keys = Object.keys(updateData);
    const values = Object.values(updateData);
    
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const [result] = await db.query(
      `UPDATE Bookings SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM Bookings WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async findAll(options = {}) {
    let query = `
      SELECT b.*, 
        u.fullName as passengerName,
        t.origin as tripOrigin,
        t.destination as tripDestination,
        t.departureTime as tripDepartureTime
      FROM Bookings b
      LEFT JOIN Users u ON b.passengerId = u.id
      LEFT JOIN Trips t ON b.tripId = t.id
    `;
    const values = [];
    const whereConditions = [];

    if (options.passengerId) {
      whereConditions.push('b.passengerId = ?');
      values.push(options.passengerId);
    }

    if (options.tripId) {
      whereConditions.push('b.tripId = ?');
      values.push(options.tripId);
    }

    if (options.status) {
      whereConditions.push('b.status = ?');
      values.push(options.status);
    }

    if (options.sacco) {
      whereConditions.push('b.sacco = ?');
      values.push(options.sacco);
    }

    if (options.date) {
      whereConditions.push('b.date = ?');
      values.push(options.date);
    }

    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }

    query += ' ORDER BY b.createdAt DESC';

    const [rows] = await db.query(query, values);
    return rows;
  }

  static async findByPassenger(passengerId) {
    return this.findAll({ passengerId });
  }

  static async findByTrip(tripId) {
    return this.findAll({ tripId });
  }

  static async updatePaymentStatus(id, paid = true, status = 'confirmed') {
    return this.update(id, { paid, status });
  }
}

export default Booking;
