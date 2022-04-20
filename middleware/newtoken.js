const jwt = require('jsonwebtoken');
const _ = require('lodash');

module.exports = function newtoken(req,res,next) {
  try{
    const token = jwt.sign(_.pick(req.user, ['_id', 'isAdmin']), 'jwtPrivateKey', {expiresIn: '300s'});
    res.header('x-auth-token', token);
    next();
  }catch(err){
    return res.status(400).send('Yangi token yaratishni imkoni bo\'lmadi');
  }
    
}