import pool from '../db/index.js';

export const addComponent = async (req, res) => {
  try {
    const {
      name,
      part_number,
      description,
      manufacturer,
      quantity = 0,
      location,
      unit_price,
      critical_threshold = 10
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Component name is required' });
    }

    // Insert only the columns that exist in your database
    const result = await pool.query(`
      INSERT INTO components (
        name, part_number, description, manufacturer, quantity, 
        location, unit_price, critical_threshold
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      name, part_number, description, manufacturer, quantity,
      location, unit_price, critical_threshold
    ]);

    res.status(201).json({
      message: 'Component added successfully',
      component: result.rows[0]
    });

  } catch (error) {
    console.error('Error adding component:', error);
    
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'Part number already exists' });
    }
    
    res.status(500).json({ error: 'Failed to add component' });
  }
};

export const getComponents = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(`
      SELECT 
        id, name, part_number, description, manufacturer, 
        quantity, location, unit_price, critical_threshold, 
        created_at, last_moved
      FROM components 
      ORDER BY name ASC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) FROM components');
    const totalComponents = parseInt(countResult.rows[0].count);

    res.json({
      components: result.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(totalComponents / limit),
        total_components: totalComponents,
        per_page: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching components:', error);
    res.status(500).json({ error: 'Failed to fetch components' });
  }
};

export const updateComponent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      part_number,
      description,
      manufacturer,
      quantity,
      location,
      unit_price,
      critical_threshold
    } = req.body;

    // Check if component exists
    const existingComponent = await pool.query('SELECT id FROM components WHERE id = $1', [id]);
    if (existingComponent.rows.length === 0) {
      return res.status(404).json({ error: 'Component not found' });
    }

    const result = await pool.query(`
      UPDATE components SET 
        name = COALESCE($1, name),
        part_number = COALESCE($2, part_number),
        description = COALESCE($3, description),
        manufacturer = COALESCE($4, manufacturer),
        quantity = COALESCE($5, quantity),
        location = COALESCE($6, location),
        unit_price = COALESCE($7, unit_price),
        critical_threshold = COALESCE($8, critical_threshold),
        last_moved = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `, [
      name, part_number, description, manufacturer, quantity,
      location, unit_price, critical_threshold, id
    ]);

    res.json({
      message: 'Component updated successfully',
      component: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating component:', error);
    
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'Part number already exists' });
    }
    
    res.status(500).json({ error: 'Failed to update component' });
  }
};
