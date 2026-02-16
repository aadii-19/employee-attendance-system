const { generateToken } = require('./src/utils/jwt.util');
console.log(generateToken({ id: 1, role: 'employee' }));
