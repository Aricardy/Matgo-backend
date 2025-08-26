import express from 'express';
import { Op } from 'sequelize';
import Matatu from '../models/Matatu.js';

const router = express.Router();

// Get all long distance buses
router.get('/', async (req, res) => {
  try {
    const buses = await Matatu.findAll({
      where: {
        type: 'Long Distance',
      },
    });
    res.json({ data: buses });
  } catch (error) {
    console.error('Error fetching long distance buses:', error);
    res.status(500).json({ error: 'Failed to fetch long distance buses' });
  }
});

// Add a new long distance bus
router.post('/', async (req, res) => {
  try {
    const {
      name,
      sacco,
      route,
      capacity,
      identifier,
      type = 'Long Distance',
      status = 'Active'
    } = req.body;

    const bus = await Matatu.create({
      name,
      sacco,
      route,
      capacity,
      identifier,
      type,
      status,
    });

    res.status(201).json(bus);
  } catch (error) {
    console.error('Error creating long distance bus:', error);
    res.status(500).json({ error: 'Failed to create long distance bus' });
  }
});

// Get a specific long distance bus
router.get('/:id', async (req, res) => {
  try {
    const bus = await Matatu.findOne({
      where: {
        id: req.params.id,
        type: 'Long Distance'
      }
    });

    if (!bus) {
      return res.status(404).json({ error: 'Long distance bus not found' });
    }

    res.json(bus);
  } catch (error) {
    console.error('Error fetching long distance bus:', error);
    res.status(500).json({ error: 'Failed to fetch long distance bus' });
  }
});

// Update a long distance bus
router.put('/:id', async (req, res) => {
  try {
    const bus = await Matatu.findOne({
      where: {
        id: req.params.id,
        type: 'Long Distance'
      }
    });

    if (!bus) {
      return res.status(404).json({ error: 'Long distance bus not found' });
    }

    await bus.update(req.body);
    res.json(bus);
  } catch (error) {
    console.error('Error updating long distance bus:', error);
    res.status(500).json({ error: 'Failed to update long distance bus' });
  }
});

// Delete a long distance bus
router.delete('/:id', async (req, res) => {
  try {
    const bus = await Matatu.findOne({
      where: {
        id: req.params.id,
        type: 'Long Distance'
      }
    });

    if (!bus) {
      return res.status(404).json({ error: 'Long distance bus not found' });
    }

    await bus.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting long distance bus:', error);
    res.status(500).json({ error: 'Failed to delete long distance bus' });
  }
});

export default router;
