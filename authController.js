const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./database');

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const userExists = await db.getUserByEmail(email);
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Save user to database
    await db.createUser({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.getUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ token });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
