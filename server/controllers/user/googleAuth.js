const jwt = require('jsonwebtoken');

exports.initiateGoogleLogin = (passport) => passport.authenticate('google', { scope: ['profile', 'email'] });
exports.handleGoogleCallback = (passport) => passport.authenticate('google', {
  session: false
});
exports.generateTokenAndRedirect = (req, res) => {
  const token = jwt.sign(
    { userId: req.user._id,isVendor:req.user.isVendor, status: req.user.status },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  res.cookie('user_token', token, {
    maxAge: 3600000,
  });
  const redirectUrl = req.user.isVendor
    ? `http://localhost:5173/role-select`
    : `http://localhost:5173/`;
  res.redirect(redirectUrl);
};