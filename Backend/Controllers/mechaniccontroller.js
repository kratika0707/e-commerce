const Mechanic = require('../model/mechanic');
const bcrypt = require('bcryptjs');

exports.registerMechanic = async (req, res) => {
  const { dealerId,name, phone, password} = req.body;

  // Validate required fields
  if (!dealerId || !name || !phone  || !password ) {
      console.log('Missing required fields', req.body);
      return res.status(400).json({ error: 'All fields are required' });
  }

  try {
      const newMechanic = new Mechanic({
        dealerId:dealerId,
         name:name,
         phone:phone,
         
         
         password:password
      });

      await newMechanic.save();
      res.status(201).send({ message: 'Mechanic registered successfully' });
  } catch (error) {
      console.error('Error saving dealer:', error);
      res.status(400).json({ error: 'An error occurred while registering the dealer' });
  }
};


exports.loginMechanic = async (req, res) => {
    const { phone, password } = req.body;

  try {
    mechanic = await Mechanic.findOne({ phone });
    if (!mechanic) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, mechanic.password);
    if (password!=mechanic.password) {
      return res.status(401).json({ error: 'Invalid credential' });
    }

    // Optionally, you can generate a token here if needed
    // const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({ mechanicId: mechanic._id });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};