function checkIsAdmin(req, res, next) {
    console.log(req.user)
    /*if (req.user.isAdmin !== true) {
        return res.status(403).json({ error: 'You are not admin' });
      }*/
      next();
  }

  export default checkIsAdmin;
  