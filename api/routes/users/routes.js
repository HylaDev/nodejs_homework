import Router from 'express';

const router = Router();


router.get('/', (req, res) => {
   res.json({
    'message': 'all users'
   })
});

export default router;