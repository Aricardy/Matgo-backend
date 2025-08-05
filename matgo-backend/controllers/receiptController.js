import path from 'path';
export const downloadReceipt = async (req, res) => {
  const filePath = path.join('receipts', `${req.params.bookingId}.pdf`);
  res.download(filePath);
};
