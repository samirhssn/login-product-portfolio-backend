const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(express.json());
// app.use(cors({ origin: 'http://localhost:3000' }));
app.use(cors({ origin: 'https://login-product-portfolio-backend.onrender.com' }));

// Enhanced security middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Mock database
const users = [{
  email: 'admin@enterprise.com',
  password: bcrypt.hashSync('SecurePass123!', 10),
  role: 'admin'
}];

const products = [
  {
    id: 1,
    name: 'Enterprise Cloud Server X1',
    price: 999,
    discount: 15,
    category: 'Cloud Computing',
    description: 'Resilient cloud server for growing businesses',
    fullDescription: 'Designed for startups and small enterprises, the X1 delivers consistent uptime, daily backups, and excellent scalability.',
    features: ['NVMe SSD', 'Firewall Protection', 'Global Load Balancing', 'REST API'],
    image: 'https://res.cloudinary.com/dunlmbvk1/image/upload/v1743878100/Gemini_Generated_Image_wj0uqwj0uqwj0uqw_zurhyi.jpg'
  },
  {
    id: 2,
    name: 'Enterprise Cloud Server X5',
    price: 2999,
    discount: 10,
    category: 'Cloud Computing',
    description: 'Optimized infrastructure for high-load applications',
    fullDescription: 'X5 is tailored for high-performance computing needs with auto-scaling, live failover, and advanced analytics support.',
    features: ['Auto Scaling', 'Redundant Storage', '24/7 Support', 'Custom Networking'],
    image: 'https://res.cloudinary.com/dunlmbvk1/image/upload/v1743878445/Gemini_Generated_Image_fo66fkfo66fkfo66_fxewiq.jpg'
  },
  {
    id: 3,
    name: 'Enterprise Cloud Server X10',
    price: 3999,
    discount: 12,
    category: 'Cloud Computing',
    description: 'Maximum reliability for mission-critical apps',
    fullDescription: 'With real-time monitoring, multi-region deployment, and a 99.999% uptime SLA, X10 is built for critical enterprise workloads.',
    features: ['Real-time Monitoring', 'Multi-Region Deployments', 'SOC2 Compliance', 'Dedicated IPs'],
    image: 'https://res.cloudinary.com/dunlmbvk1/image/upload/v1743878665/Gemini_Generated_Image_f17c3zf17c3zf17c_wijjz1.jpg'
  }
];

const JWT_SECRET = 'enterprise_secret_key';

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const user = users.find(u => u.email === email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/products', (req, res) => {
  try {
    res.json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load products' });
  }
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Secure server running on port ${PORT}`));
