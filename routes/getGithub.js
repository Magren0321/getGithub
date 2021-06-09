import express from 'express';
import getRes from '../module/getRes';

const router = express.Router();

router.get('/getgithub?:name',(req,res)=>{
    getRes(req.query.name).then(data=>{
        res.json(data)
    })
})




module.exports = router;