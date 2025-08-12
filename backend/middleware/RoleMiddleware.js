

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }


    if (!roles.includes(currentUser.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};


