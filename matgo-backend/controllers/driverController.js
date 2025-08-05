import Driver from '../models/Driver.js';

export const getAll = async (req, res) => {
  const items = await Driver.findAll();
  res.json(items);
};

export const getOne = async (req, res) => {
  const item = await Driver.findByPk(req.params.id);
  item ? res.json(item) : res.status(404).json({ error: 'Driver not found' });
};

export const create = async (req, res) => {
  const item = await Driver.create(req.body);
  res.status(201).json(item);
};

export const update = async (req, res) => {
  await Driver.update(req.body, { where: { id: req.params.id } });
  res.json({ success: true });
};

export const remove = async (req, res) => {
  await Driver.destroy({ where: { id: req.params.id } });
  res.json({ deleted: true });
};
