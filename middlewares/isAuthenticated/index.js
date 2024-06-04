function isAuthenticated(req, res, next) {

    /*const token = req.cookies;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }*/
    next();
  }

  export default isAuthenticated;
  