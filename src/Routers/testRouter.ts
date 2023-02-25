import express from 'express';


const router = express.Router();


  router.post('/', (req, res) => {
    res.send('hello world')
  });


  export default router;