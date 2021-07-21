import express from 'express';
import startPuppteer from '../module/startPuppeteer';
import axios from '../request/request';

const router = express.Router();

//爬取contributon
router.get('/getAllContributions/:name',(req,res)=>{
    startPuppteer(req.params.name).then(data=>{
        res.json(data);
    })
})
//使用github api获取个人信息
router.get('/getInfo/:name',(req,res)=>{
    axios.getInfo(req.params.name).then(data=>{
        res.json(data.data);
    }).catch(e=>{
        res.json(e);
    })
})
//使用github api获取仓库的contribution
router.get('/getRepContributions/:name/:rep',(req,res)=>{
    axios.getRepContributions(req.params.name,req.params.rep).then(data=>{
        if(data.data){
            if(typeof JSON.parse(data.data)[0] !== 'undefined'){
              res.json(JSON.parse(data.data)[0]);
            }
        }
    }).catch(e=>{
        res.json(e);
    })
})
//使用github api获取个人所有公开仓库
router.get('/getRep/:name?:page',(req,res)=>{
    axios.getRep(req.params.name,req.query.page).then(data=>{
        res.json(JSON.parse(data.data));
    }).catch(e=>{
        res.json(e);
    })
})


module.exports = router;