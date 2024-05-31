import Router from 'express';

const router = Router();


router.get('/', (req, res) => {
   res.json({
    'message': 'all variations'
   })
});

export default router;