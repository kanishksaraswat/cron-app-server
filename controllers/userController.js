const User = require('../models/User');
const jwt = require('../utils/jwt');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = jwt.hashPassword(password);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send('Registered Successfully...');
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !jwt.comparePassword(password, user.password)) {
        return res.status(401).send({ error: 'Invalid credentials' });
    }
    const token = jwt.generateToken(user);
    res.send({ token });
};
