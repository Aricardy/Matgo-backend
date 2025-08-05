import Driver from '../models/Driver.js';
import Conductor from '../models/Conductor.js';
import Matatu from '../models/Matatu.js';
import Sacco from '../models/Sacco.js';
import { createUserEntry } from '../utils/userUtils.js';

export const addDriver = async (req, res) => {
  try {
    const { fullName, email, phone, password, nationalId, saccoName, busIdentifier, busType } = req.body;
    
    // Create entry in Users table first
    const userEntry = await createUserEntry({
      fullName,
      email,
      phone,
      password
    }, 'driver');

    // Find or create Sacco
    let saccoRecord = await Sacco.findOne({ where: { name: saccoName } });
    if (!saccoRecord) {
      saccoRecord = await Sacco.create({ name: saccoName });
    }

    // Create the driver entry
    const driver = await Driver.create({
      fullName,
      email,
      phone,
      password: userEntry.password,
      nationalId,
      sacco: saccoName,
      busIdentifier,
      busType,
      avatar: req.file?.avatar?.path || null,
      busPic: req.file?.busPic?.path || null,
      nationalIdImage: req.file?.nationalIdImage?.path || null,
      saccoId: saccoRecord.id
    });

    res.status(201).json({
      message: 'Driver registered successfully',
      driver
    });
  } catch (error) {
    console.error('Error registering driver:', error);
    res.status(500).json({
      error: 'Failed to register driver',
      details: error.message
    });
  }
};

export const addConductor = async (req, res) => {
  try {
    const { fullName, email, phone, password, nationalId, saccoName, busIdentifier, busType } = req.body;
    
    // Create entry in Users table first
    const userEntry = await createUserEntry({
      fullName,
      email,
      phone,
      password
    }, 'conductor');

    // Find or create Sacco
    let saccoRecord = await Sacco.findOne({ where: { name: saccoName } });
    if (!saccoRecord) {
      saccoRecord = await Sacco.create({ name: saccoName });
    }

    // Create the conductor entry
    const conductor = await Conductor.create({
      fullName,
      email,
      phone,
      password: userEntry.password,
      nationalId,
      sacco: saccoName,
      busIdentifier,
      busType,
      avatar: req.file?.avatar?.path || null,
      busPic: req.file?.busPic?.path || null,
      nationalIdImage: req.file?.nationalIdImage?.path || null,
      saccoId: saccoRecord.id
    });

    res.status(201).json({
      message: 'Conductor registered successfully',
      conductor
    });
  } catch (error) {
    console.error('Error registering conductor:', error);
    res.status(500).json({
      error: 'Failed to register conductor',
      details: error.message
    });
  }
};
