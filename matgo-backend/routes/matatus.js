import express from 'express';
import Matatu from '../models/Matatu.js';
import QRCode from 'qrcode';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await Matatu.findAll({
      attributes: ['id', 'sacco', 'identifier', 'busType', 'route', 'featured', 'createdAt', 'updatedAt']
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching matatus:', error);
    res.status(500).json({ error: 'Failed to fetch matatus' });
  }
});

router.post('/', async (req, res) => {
  try {
    const record = await Matatu.create(req.body);

    // Automatically generate QR code after registration
    const qrData = `MATGO_BUS::${record.id}_${record.name || 'N/A'}_${record.route || 'N/A'}_${record.fare || 'N/A'}_${record.sacco || 'N/A'}_${record.type || 'Bus'}`;
    record.qrCode = await QRCode.toDataURL(qrData);
    await record.save();

    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const identifier = req.params.id;
    console.log('Searching for matatu with identifier:', identifier);
    
    // Try to find by ID first
    let item = await Matatu.findByPk(identifier);
    console.log('Result by ID:', item);
    
    // If not found by ID, try to find by identifier
    if (!item) {
      console.log('Not found by ID, trying identifier');
      item = await Matatu.findOne({
        where: { identifier: identifier }
      });
      console.log('Result by identifier:', item);
    }

    if (!item) {
      console.log('Matatu not found');
      return res.status(404).json({ error: 'Matatu not found' });
    }

    console.log('Matatu found:', item);
    res.json(item);
  } catch (err) {
    console.error('Error fetching matatu:', err);
    res.status(500).json({ error: 'Server error while fetching matatu' });
  }
});

// Generate QR code for a specific matatu
router.post('/:id/generate-qr', async (req, res) => {
  try {
    const matatuId = req.params.id;
    const matatu = await Matatu.findByPk(matatuId);

    if (!matatu) {
      return res.status(404).json({ error: 'Matatu not found' });
    }

    // Generate QR code data
    const qrData = `MATGO_BUS::${matatu.id}_${matatu.name || 'N/A'}_${matatu.route || 'N/A'}_${matatu.fare || 'N/A'}_${matatu.sacco || 'N/A'}_${matatu.type || 'Bus'}`;
    const qrCode = await QRCode.toDataURL(qrData);

    // Save QR code to the database (assuming a `qrCode` field exists)
    matatu.qrCode = qrCode;
    await matatu.save();

    res.status(201).json({ qrCode });
  } catch (err) {
    console.error('Error generating QR code:', err);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Retrieve QR code for a specific matatu
router.get('/:id/qr', async (req, res) => {
  try {
    const matatuId = req.params.id;
    const matatu = await Matatu.findByPk(matatuId);

    if (!matatu || !matatu.qrCode) {
      return res.status(404).json({ error: 'QR code not found for this matatu' });
    }

    res.json({ qrCode: matatu.qrCode });
  } catch (err) {
    console.error('Error retrieving QR code:', err);
    res.status(500).json({ error: 'Failed to retrieve QR code' });
  }
});

// Endpoint to validate QR code
router.post('/validate-qr', async (req, res) => {
  try {
    const { qrData } = req.body;

    if (!qrData) {
      return res.status(400).json({ error: 'QR data is required' });
    }

    // Extract matatu ID from QR data
    const match = qrData.match(/MATGO_BUS::(\d+)_/);
    if (!match) {
      return res.status(400).json({ error: 'Invalid QR data format' });
    }

    const matatuId = match[1];
    const matatu = await Matatu.findByPk(matatuId);

    if (!matatu) {
      return res.status(404).json({ error: 'Matatu not found' });
    }

    res.json({ message: 'QR code is valid', matatu });
  } catch (err) {
    console.error('Error validating QR code:', err);
    res.status(500).json({ error: 'Failed to validate QR code' });
  }
});

export default router;
