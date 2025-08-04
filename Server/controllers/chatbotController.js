// Server/controllers/chatbotController.js
import pool from '../db/index.js';

export const processChatbotQuery = async (req, res) => {
  try {
    const { query, userId } = req.body;
    
    // Simple intent recognition
    const intent = recognizeIntent(query.toLowerCase());
    let response;

    switch (intent) {
      case 'stock_check':
        response = await handleStockQuery(query);
        break;
      case 'location_find':
        response = await handleLocationQuery(query);
        break;
      case 'low_stock':
        response = await handleLowStockQuery();
        break;
      case 'recent_transactions':
        response = await handleRecentTransactions(userId);
        break;
      default:
        response = "I can help you with:\n- Check stock levels\n- Find component locations\n- View low stock alerts\n- Recent transactions\n\nTry asking: 'What is the stock of component X?' or 'Where is component Y located?'";
    }

    // Log chatbot interaction (handle missing table gracefully)
    try {
      await pool.query(
        'INSERT INTO chatbot_logs (user_id, query, response, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)',
        [userId, query, response]
      );
    } catch (logError) {
      console.log('Note: chatbot_logs table not found - continuing without logging');
    }

    res.json({ response });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Chatbot service unavailable' });
  }
};

function recognizeIntent(query) {
  if (query.includes('stock') || query.includes('quantity') || query.includes('how many')) {
    return 'stock_check';
  }
  if (query.includes('where') || query.includes('location') || query.includes('find')) {
    return 'location_find';
  }
  if (query.includes('low stock') || query.includes('critical')) {
    return 'low_stock';
  }
  if (query.includes('recent') || query.includes('transactions') || query.includes('history')) {
    return 'recent_transactions';
  }
  return 'general';
}

async function handleStockQuery(query) {
  try {
    // Extract component name from query
    const words = query.split(' ');
    let componentName = '';
    
    // Simple extraction - you can improve this with NLP
    for (let i = 0; i < words.length; i++) {
      if (words[i] === 'of' && i + 1 < words.length) {
        componentName = words.slice(i + 1).join(' ');
        break;
      }
    }

    if (!componentName) {
      return "Please specify the component name. Example: 'What is the stock of Arduino Uno?'";
    }

    const result = await pool.query(
      `SELECT name, quantity, critical_threshold, location 
       FROM components 
       WHERE LOWER(name) LIKE LOWER($1) OR LOWER(part_number) LIKE LOWER($1)
       LIMIT 5`,
      [`%${componentName}%`]
    );

    if (result.rows.length === 0) {
      return `No components found matching "${componentName}".`;
    }

    let response = `Stock information:\n`;
    result.rows.forEach(component => {
      const status = component.quantity <= component.critical_threshold ? ' ⚠️ LOW STOCK' : '';
      response += `• ${component.name}: ${component.quantity} units${status}\n`;
      if (component.location) {
        response += `  Location: ${component.location}\n`;
      }
    });

    return response;

  } catch (error) {
    return "Error checking stock levels.";
  }
}

async function handleLocationQuery(query) {
  try {
    const words = query.split(' ');
    let componentName = '';
    
    for (let i = 0; i < words.length; i++) {
      if ((words[i] === 'is' || words[i] === 'where') && i + 1 < words.length) {
        // Fixed the regex error - properly escape the question mark and use word boundaries
        componentName = words.slice(i + 1).join(' ').replace(/located|\?/g, '').trim();
        break;
      }
    }

    if (!componentName) {
      return "Please specify the component name. Example: 'Where is Arduino Uno located?'";
    }

    const result = await pool.query(
      `SELECT name, location, quantity 
       FROM components 
       WHERE LOWER(name) LIKE LOWER($1) OR LOWER(part_number) LIKE LOWER($1)
       LIMIT 5`,
      [`%${componentName}%`]
    );

    if (result.rows.length === 0) {
      return `No components found matching "${componentName}".`;
    }

    let response = `Location information:\n`;
    result.rows.forEach(component => {
      response += `• ${component.name}\n`;
      response += `  Location: ${component.location || 'Not specified'}\n`;
      response += `  Stock: ${component.quantity} units\n\n`;
    });

    return response;

  } catch (error) {
    return "Error finding component location.";
  }
}

async function handleLowStockQuery() {
  try {
    const result = await pool.query(
      `SELECT name, quantity, critical_threshold, location
       FROM components 
       WHERE quantity <= critical_threshold
       ORDER BY (quantity::float / critical_threshold) ASC
       LIMIT 10`
    );

    if (result.rows.length === 0) {
      return "✅ All components have sufficient stock!";
    }

    let response = `⚠️ Low Stock Alert (${result.rows.length} items):\n\n`;
    result.rows.forEach(component => {
      const percentage = Math.round((component.quantity / component.critical_threshold) * 100);
      response += `• ${component.name}\n`;
      response += `  Current: ${component.quantity} units (${percentage}% of threshold)\n`;
      response += `  Location: ${component.location || 'Not specified'}\n\n`;
    });

    return response;

  } catch (error) {
    return "Error checking low stock items.";
  }
}

async function handleRecentTransactions(userId) {
  try {
    const result = await pool.query(
      `SELECT 
        t.transaction_type,
        t.quantity,
        t.created_at,
        c.name as component_name,
        u.username
       FROM inventory_transactions t
       JOIN components c ON t.component_id = c.id
       LEFT JOIN users u ON t.user_id = u.id
       WHERE t.user_id = $1
       ORDER BY t.created_at DESC
       LIMIT 5`,
      [userId]
    );

    if (result.rows.length === 0) {
      return "No recent transactions found.";
    }

    let response = `Your recent transactions:\n\n`;
    result.rows.forEach(transaction => {
      const date = new Date(transaction.created_at).toLocaleDateString();
      const type = transaction.transaction_type.toUpperCase();
      response += `• ${date}: ${type} ${transaction.quantity} units of ${transaction.component_name}\n`;
    });

    return response;

  } catch (error) {
    return "Error fetching recent transactions.";
  }
}