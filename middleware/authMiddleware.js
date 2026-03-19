const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = { protect };