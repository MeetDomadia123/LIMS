// Server/controllers/metricsController.js
import pool from '../db/index.js';

// Dashboard metrics endpoint
export const getDashboardMetrics = async (req, res) => {
  try {
    const { timeRange = '7d' } = req.query;
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '1d':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }

    // Get various metrics
    const [
      totalComponents,
      lowStockItems,
      totalTransactions,
      recentTransactions
    ] = await Promise.all([
      getTotalComponents(),
      getLowStockItems(),
      getTotalTransactions(startDate, endDate),
      getRecentTransactions(10)
    ]);

    res.json({
      summary: {
        total_components: totalComponents,
        low_stock_items: lowStockItems.count,
        total_transactions: totalTransactions,
        time_range: timeRange
      },
      low_stock_items: lowStockItems.items,
      recent_transactions: recentTransactions
    });

  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
};

// Grafana compatible endpoints
export const getGrafanaMetrics = async (req, res) => {
  try {
    const { metric, from, to } = req.query;
    
    const startDate = new Date(parseInt(from));
    const endDate = new Date(parseInt(to));

    let data;
    
    switch (metric) {
      case 'stock_levels':
        data = await getStockLevelsTimeSeries(startDate, endDate);
        break;
      case 'transaction_count':
        data = await getTransactionCountTimeSeries(startDate, endDate);
        break;
      case 'low_stock_count':
        data = await getLowStockCountTimeSeries(startDate, endDate);
        break;
      default:
        return res.status(400).json({ error: 'Invalid metric' });
    }

    // Format for Grafana
    const grafanaFormat = data.map(point => [
      point.value,
      new Date(point.timestamp).getTime()
    ]);

    res.json(grafanaFormat);

  } catch (error) {
    console.error('Error fetching Grafana metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
};

// Grafana health check
export const grafanaHealth = async (req, res) => {
  res.status(200).send('OK');
};

// Grafana search endpoint
export const grafanaSearch = async (req, res) => {
  const metrics = [
    'total_components',
    'low_stock_count',
    'daily_transactions',
    'transaction_volume',
    'critical_stock_alerts'
  ];
  res.json(metrics);
};

// Grafana query endpoint
export const grafanaQuery = async (req, res) => {
  try {
    const { targets, range } = req.body;
    const results = [];

    for (const target of targets) {
      const { target: metric } = target;
      const from = new Date(range.from);
      const to = new Date(range.to);

      let datapoints = [];

      switch (metric) {
        case 'total_components':
          datapoints = await getTotalComponentsTimeSeries();
          break;
        case 'low_stock_count':
          datapoints = await getLowStockTimeSeries();
          break;
        case 'daily_transactions':
          datapoints = await getDailyTransactionsTimeSeries(from, to);
          break;
        case 'transaction_volume':
          datapoints = await getTransactionVolumeTimeSeries(from, to);
          break;
        case 'critical_stock_alerts':
          datapoints = await getCriticalStockAlerts();
          break;
        default:
          datapoints = [];
      }

      results.push({
        target: metric,
        datapoints: datapoints
      });
    }

    res.json(results);

  } catch (error) {
    console.error('Grafana query error:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
};

// Helper functions for different metrics
async function getTotalComponentsTimeSeries() {
  try {
    const result = await pool.query(`
      SELECT COUNT(*) as value, CURRENT_TIMESTAMP as time
      FROM components
    `);
    
    const count = parseInt(result.rows[0].value);
    const timestamp = new Date().getTime();
    
    return [[count, timestamp]];
  } catch (error) {
    console.error('Error getting total components:', error);
    return [];
  }
}

async function getLowStockTimeSeries() {
  try {
    const result = await pool.query(`
      SELECT COUNT(*) as value
      FROM components
      WHERE quantity <= critical_threshold
    `);
    
    const count = parseInt(result.rows[0].value);
    const timestamp = new Date().getTime();
    
    return [[count, timestamp]];
  } catch (error) {
    console.error('Error getting low stock count:', error);
    return [];
  }
}

async function getDailyTransactionsTimeSeries(from, to) {
  try {
    const result = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM inventory_transactions
      WHERE created_at BETWEEN $1 AND $2
      GROUP BY DATE(created_at)
      ORDER BY date
    `, [from, to]);
    
    return result.rows.map(row => [
      parseInt(row.count),
      new Date(row.date).getTime()
    ]);
  } catch (error) {
    console.error('Error getting daily transactions:', error);
    return [];
  }
}

async function getStockLevelsByComponent() {
  try {
    const result = await pool.query(`
      SELECT 
        name,
        quantity,
        critical_threshold
      FROM components
      ORDER BY quantity ASC
      LIMIT 20
    `);
    
    return result.rows.map((row, index) => [
      row.quantity,
      Date.now() + (index * 1000) // Spread points for better visualization
    ]);
  } catch (error) {
    console.error('Error getting stock levels:', error);
    return [];
  }
}

async function getTransactionVolumeTimeSeries(from, to) {
  try {
    const result = await pool.query(`
      SELECT 
        DATE_TRUNC('hour', created_at) as hour,
        SUM(quantity) as total_quantity
      FROM inventory_transactions
      WHERE created_at BETWEEN $1 AND $2
      GROUP BY DATE_TRUNC('hour', created_at)
      ORDER BY hour
    `, [from, to]);
    
    return result.rows.map(row => [
      parseInt(row.total_quantity),
      new Date(row.hour).getTime()
    ]);
  } catch (error) {
    console.error('Error getting transaction volume:', error);
    return [];
  }
}

async function getCriticalStockAlerts() {
  try {
    const result = await pool.query(`
      SELECT 
        name,
        quantity,
        critical_threshold,
        (quantity::float / critical_threshold * 100) as percentage
      FROM components
      WHERE quantity <= critical_threshold
      ORDER BY percentage ASC
    `);
    
    return result.rows.map((row, index) => [
      Math.round(row.percentage),
      Date.now() + (index * 1000)
    ]);
  } catch (error) {
    console.error('Error getting critical stock alerts:', error);
    return [];
  }
}

// Dashboard summary for Grafana table panels
export const getDashboardSummary = async (req, res) => {
  try {
    const [totalComponents, lowStockItems, totalUsers, todayTransactions] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM components'),
      pool.query('SELECT COUNT(*) FROM components WHERE quantity <= critical_threshold'),
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM inventory_transactions WHERE created_at >= CURRENT_DATE')
    ]);

    res.json({
      columns: [
        { text: "Metric", type: "string" },
        { text: "Value", type: "number" },
        { text: "Status", type: "string" }
      ],
      rows: [
        ["Total Components", parseInt(totalComponents.rows[0].count), "info"],
        ["Low Stock Items", parseInt(lowStockItems.rows[0].count), parseInt(lowStockItems.rows[0].count) > 0 ? "critical" : "success"],
        ["Total Users", parseInt(totalUsers.rows[0].count), "info"],
        ["Today's Transactions", parseInt(todayTransactions.rows[0].count), "info"]
      ]
    });

  } catch (error) {
    console.error('Error getting dashboard summary:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
};

async function getTotalComponents() {
  const result = await pool.query('SELECT COUNT(*) FROM components');
  return parseInt(result.rows[0].count);
}

async function getLowStockItems() {
  const result = await pool.query(`
    SELECT COUNT(*) as count,
           JSON_AGG(
             JSON_BUILD_OBJECT(
               'name', name,
               'quantity', quantity,
               'critical_threshold', critical_threshold
             )
           ) as items
    FROM components 
    WHERE quantity <= critical_threshold
  `);
  
  return {
    count: parseInt(result.rows[0].count),
    items: result.rows[0].items || []
  };
}

async function getTotalTransactions(startDate, endDate) {
  const result = await pool.query(
    'SELECT COUNT(*) FROM inventory_transactions WHERE created_at BETWEEN $1 AND $2',
    [startDate, endDate]
  );
  return parseInt(result.rows[0].count);
}

async function getRecentTransactions(limit) {
  const result = await pool.query(`
    SELECT 
      t.transaction_type,
      t.quantity,
      t.created_at,
      c.name as component_name,
      u.username
    FROM inventory_transactions t
    JOIN components c ON t.component_id = c.id
    LEFT JOIN users u ON t.user_id = u.id
    ORDER BY t.created_at DESC
    LIMIT $1
  `, [limit]);
  
  return result.rows;
}

async function getStockLevels() {
  const result = await pool.query(`
    SELECT 
      name,
      quantity,
      critical_threshold,
      CASE 
        WHEN quantity <= critical_threshold THEN 'critical'
        WHEN quantity <= critical_threshold * 1.5 THEN 'low'
        ELSE 'normal'
      END as status
    FROM components
    ORDER BY quantity ASC
    LIMIT 20
  `);
  
  return result.rows;
}

async function getTransactionTrends(startDate, endDate) {
  const result = await pool.query(`
    SELECT 
      DATE(created_at) as date,
      transaction_type,
      COUNT(*) as count,
      SUM(quantity) as total_quantity
    FROM inventory_transactions
    WHERE created_at BETWEEN $1 AND $2
    GROUP BY DATE(created_at), transaction_type
    ORDER BY date DESC
  `, [startDate, endDate]);
  
  return result.rows;
}

// JSON API compatible endpoint
export const getJsonApiData = async (req, res) => {
  try {
    const { metric } = req.query;
    const now = Date.now();
    
    let data = [];
    
    switch (metric) {
      case 'total_components':
        const totalResult = await pool.query('SELECT COUNT(*) FROM components');
        data = [{
          time: now,
          value: parseInt(totalResult.rows[0].count),
          metric: 'total_components'
        }];
        break;
        
      case 'low_stock_count':
        const lowStockResult = await pool.query('SELECT COUNT(*) FROM components WHERE quantity <= critical_threshold');
        data = [{
          time: now,
          value: parseInt(lowStockResult.rows[0].count),
          metric: 'low_stock_count'
        }];
        break;
        
      case 'daily_transactions':
        const transResult = await pool.query(`
          SELECT 
            DATE(created_at) as date,
            COUNT(*) as count
          FROM inventory_transactions
          WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
          GROUP BY DATE(created_at)
          ORDER BY date
        `);
        
        data = transResult.rows.map(row => ({
          time: new Date(row.date).getTime(),
          value: parseInt(row.count),
          metric: 'daily_transactions'
        }));
        break;
        
      default:
        // Return sample data for testing
        data = [
          { time: now - 300000, value: Math.floor(Math.random() * 50), metric: metric || 'sample' },
          { time: now - 240000, value: Math.floor(Math.random() * 50), metric: metric || 'sample' },
          { time: now - 180000, value: Math.floor(Math.random() * 50), metric: metric || 'sample' },
          { time: now - 120000, value: Math.floor(Math.random() * 50), metric: metric || 'sample' },
          { time: now - 60000, value: Math.floor(Math.random() * 50), metric: metric || 'sample' },
          { time: now, value: Math.floor(Math.random() * 50), metric: metric || 'sample' }
        ];
    }
    
    res.json(data);
    
  } catch (error) {
    console.error('JSON API error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

// Test endpoint for Grafana
export const getTestMetrics = async (req, res) => {
  const now = Date.now();
  const testData = [];
  
  // Generate sample time series data
  for (let i = 10; i >= 0; i--) {
    testData.push({
      time: now - (i * 60000), // Every minute
      total_components: Math.floor(Math.random() * 100) + 50,
      low_stock_count: Math.floor(Math.random() * 10),
      daily_transactions: Math.floor(Math.random() * 20)
    });
  }
  
  res.json(testData);
};

// Prometheus-style metrics (alternative approach)
export const getPrometheusMetrics = async (req, res) => {
  try {
    const [totalComponents, lowStockItems] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM components'),
      pool.query('SELECT COUNT(*) FROM components WHERE quantity <= critical_threshold')
    ]);

    const metrics = `
# HELP lims_total_components Total number of components in inventory
# TYPE lims_total_components gauge
lims_total_components ${totalComponents.rows[0].count}

# HELP lims_low_stock_items Number of components with low stock
# TYPE lims_low_stock_items gauge
lims_low_stock_items ${lowStockItems.rows[0].count}

# HELP lims_components_by_status Components grouped by stock status
# TYPE lims_components_by_status gauge
lims_components_by_status{status="normal"} ${parseInt(totalComponents.rows[0].count) - parseInt(lowStockItems.rows[0].count)}
lims_components_by_status{status="low"} ${lowStockItems.rows[0].count}
`;

    res.set('Content-Type', 'text/plain');
    res.send(metrics);
    
  } catch (error) {
    console.error('Prometheus metrics error:', error);
    res.status(500).send('# Error generating metrics');
  }
};

// Simple endpoint for Grafana beginners
export const getSimpleMetrics = async (req, res) => {
  try {
    // Get real data from database
    const [components, lowStock, transactions] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM components'),
      pool.query('SELECT COUNT(*) FROM components WHERE quantity <= critical_threshold'),
      pool.query('SELECT COUNT(*) FROM inventory_transactions WHERE created_at >= CURRENT_DATE')
    ]);

    const now = new Date().toISOString();
    
    // Return simple format for Grafana
    const data = [
      {
        "timestamp": now,
        "total_components": parseInt(components.rows[0].count),
        "low_stock_items": parseInt(lowStock.rows[0].count),
        "todays_transactions": parseInt(transactions.rows[0].count)
      }
    ];

    res.json(data);

  } catch (error) {
    console.error('Simple metrics error:', error);
    // Return sample data if database fails
    res.json([
      {
        "timestamp": new Date().toISOString(),
        "total_components": 25,
        "low_stock_items": 3,
        "todays_transactions": 8
      }
    ]);
  }
};