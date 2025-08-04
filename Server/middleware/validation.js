export const validateComponent = (req, res, next) => {
  const { name } = req.body;
  
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Component name is required' });
  }
  
  next();
};

export const validateTransaction = (req, res, next) => {
  const { component_id, transaction_type, quantity } = req.body;
  
  if (!component_id) {
    return res.status(400).json({ error: 'Component ID is required' });
  }
  
  if (!['in', 'out', 'adjustment'].includes(transaction_type)) {
    return res.status(400).json({ error: 'Invalid transaction type' });
  }
  
  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Quantity must be positive' });
  }
  
  next();
};