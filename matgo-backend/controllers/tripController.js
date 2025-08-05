import Trip from '../models/Trip.js';

export const getAll = async (req, res) => {
  const items = await Trip.findAll();
  res.json(items);
};

export const getOne = async (req, res) => {
  const item = await Trip.findByPk(req.params.id);
  item ? res.json(item) : res.status(404).json({ error: 'Trip not found' });
};

export const create = async (req, res) => {
  const item = await Trip.create(req.body);
  res.status(201).json(item);
};

export const update = async (req, res) => {
  await Trip.update(req.body, { where: { id: req.params.id } });
  res.json({ success: true });
};

export const remove = async (req, res) => {
  await Trip.destroy({ where: { id: req.params.id } });
  res.json({ deleted: true });
};
