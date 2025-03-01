// Step 1: Import modules
const express = require('express');
const app = express();
const morgan = require('morgan');
const { readdirSync } = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

// Middleware
app.use(morgan('dev'));
app.use(express.json({ limit: '20mb' })); // ใช้ Express JSON parser

// ✅ ใช้ body-parser เฉพาะ POST และ PUT เท่านั้น
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    bodyParser.json()(req, res, next);
  } else {
    next();
  }
});

app.use(cors());

// ✅ โหลด Router อัตโนมัติจากโฟลเดอร์ routes
readdirSync('./routes').map((file) => {
  app.use('/api', require('./routes/' + file));
});

// ✅ ตรวจสอบว่าเซิร์ฟเวอร์ทำงานได้
app.get('/', (req, res) => {
  res.send('🚀 Server is running!');
});

// Step 2: Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
