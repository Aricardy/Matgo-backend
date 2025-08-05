import Passenger from '../models/Passenger.js';
import { createUserEntry } from '../utils/userUtils.js';

export const getAll = async (req, res) => {
  const items = await Passenger.findAll();
  res.json(items);
};

export const getOne = async (req, res) => {
  const item = await Passenger.findByPk(req.params.id);
  item ? res.json(item) : res.status(404).json({ error: 'Passenger not found' });
};

export const create = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // Create entry in Users table first
    const userEntry = await createUserEntry({
      fullName,
      email,
      phone,
      password
    }, 'passenger');

    // Create the passenger entry
    const passenger = await Passenger.create({
      fullName,
      email,
      phone,
      password: userEntry.password,
      avatar: req.file?.avatar?.path || null
    });

    res.status(201).json({
      message: 'Passenger registered successfully',
      passenger
    });
  } catch (error) {
    console.error('Error registering passenger:', error);
    res.status(500).json({
      error: 'Failed to register passenger',
      details: error.message
    });
  }
};

export const update = async (req, res) => {
  await Passenger.update(req.body, { where: { id: req.params.id } });
  res.json({ success: true });
};

export const remove = async (req, res) => {
  await Passenger.destroy({ where: { id: req.params.id } });
  res.json({ deleted: true });
};
