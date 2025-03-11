import jwt from 'jsonwebtoken';

// Verify JWT token
export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; // Check cookies or Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    // req.user = decoded; // Attach the decoded user data to the request object
    next();
  } catch (err) {
    console.error('Token Verification Error:', err);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

// Check if the user is an admin
export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') { // Use optional chaining to avoid errors if req.user is undefined
    return res.status(403).json({ message: `${req.user?.role || 'User'} cannot access this resource!` });
  }
  next();
};

// Check if the user is a faculty member
export const faculty = (req, res, next) => {
  if (req.user?.role === 'faculty') { // Use optional chaining to avoid errors if req.user is undefined
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized as faculty' }); // Return a JSON response instead of throwing an error
  }
};
// Middleware to check if the user is an admin or faculty
export const isAdminOrFaculty = (req, res, next) => {
  if (req.user?.role === 'admin' || req.user?.role === 'faculty') {
    next(); // Allow access
  } else {
    return res.status(403).json({ message: 'Access denied. You must be an admin or faculty member.' });
  }
};