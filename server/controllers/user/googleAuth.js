const jwt = require('jsonwebtoken');

exports.initiateGoogleLogin = (passport) => passport.authenticate('google', { scope: ['profile', 'email'] });
exports.handleGoogleCallback = (passport) => passport.authenticate('google', {
  failureRedirect: '/login',
  session: false,
});
exports.generateTokenAndRedirect = (req, res) => {
  const token = jwt.sign(
    { userId: req.user._id, status: req.user.status },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  res.cookie('user_token', token, {
    maxAge: 3600000,
  });
  res.redirect('http://localhost:5173?replace=true');
};