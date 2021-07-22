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
router.get('/getRep/:name',(req,res)=>{
    let reposLength = 0; //个人公开仓库的总数
    let pages = 1; //请求的页数
    let arr = []; //结果数组
    axios.getInfo(req.params.name).then(info=>{
        reposLength = info.data.public_repos;
    }).then(async ()=>{
        //每次最多申请100条个人仓库的数据，当结果数组和个人公开仓库的总数对不上的时候，就循环发起请求，使用async/await
        while(reposLength !== arr.length){
            await axios.getRep(req.params.name,pages).then(data=>{
                arr = arr.concat(JSON.parse(data.data));
                pages++;
            });
        }
        res.json(arr);
    }).catch(e=>{
        res.json(e);
    })
})


module.exports = router;