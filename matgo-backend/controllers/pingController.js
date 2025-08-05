export const ping = (req, res) => {
  res.json({ message: 'Backend connected to frontend via controller!' });
};

export const sampleData = (req, res) => {
  res.json({ data: 'Sample response from controller (no DB yet)' });
};
