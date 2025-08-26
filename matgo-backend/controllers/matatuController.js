import Matatu from '../models/Matatu.js';

export const addMatatu = async (req, res) => {
  const { name, plateNumber, saccoId, routeId } = req.body;
  const image = req.file ? req.file.path : null;
  const matatu = await Matatu.create({ name, plateNumber, saccoId, routeId, image });
  res.json(matatu);
};

// Get featured matatus
export const getFeaturedMatatus = async (req, res) => {
  try {
    const featured = await Matatu.findAll({ where: { featured: true } });
    res.json(featured);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch featured matatus' });
  }
};

export const getAll = async (req, res) => {
  const items = await Matatu.findAll();
  res.json(items);
};

export const getOne = async (req, res) => {
  try {
    const searchValue = req.params.id;
    
    // Try to find by ID first
    let item = await Matatu.findByPk(searchValue);
    
    // If not found by ID, try to find by identifier
    if (!item) {
      item = await Matatu.findOne({
        where: { identifier: searchValue }
      });
    }

    if (!item) {
      return res.status(404).json({ error: 'Matatu not found' });
    }

    res.json(item);
  } catch (err) {
    console.error('Error fetching matatu:', err);
    res.status(500).json({ error: 'Server error while fetching matatu' });
  }
};

export const create = async (req, res) => {
  const item = await Matatu.create(req.body);
  res.status(201).json(item);
};

export const update = async (req, res) => {
  await Matatu.update(req.body, { where: { id: req.params.id } });
  res.json({ success: true });
};

export const remove = async (req, res) => {
  await Matatu.destroy({ where: { id: req.params.id } });
  res.json({ deleted: true });
};
