const adminAuth = async (req, res, next) => {
  try {
    // req.user is already set by the authenticate middleware
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  } catch (error) {
    res.status(403).json({ error: "Admin access required" });
  }
};

module.exports = adminAuth;
