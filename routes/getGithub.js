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
        if(info.status!==200){
            res.json({
                status:info.status,
                msg:info.data.msg
            });
            return;
        }
        res.json(data.data);
    }).catch(e=>{
        res.json(e);
    })
})
//使用github api获取仓库的contribution
router.get('/getRepContributions/:name/:rep',(req,res)=>{
    axios.getRepContributions(req.params.name,req.params.rep).then(data=>{
        if(info.status!==200){
            res.json({
                status:info.status,
                msg:info.data.msg
            });
            return;
        }
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
    console.log('开始请求个人信息')
    axios.getInfo(req.params.name).then(info=>{
        if(info.status!==200){
            res.json({
                status:info.status,
                msg:info.data.msg
            });
            return;
        }else{
            reposLength = info.data.public_repos;
            console.log('个人公开仓库',reposLength);
        }
    }).then(async ()=>{
        //每次最多申请100条个人仓库的数据，当结果数组和个人公开仓库的总数对不上的时候，就循环发起请求，使用async/await
        while(reposLength !== arr.length){
            console.log('开始请求个人仓库')
            await axios.getRep(req.params.name,pages).then(data=>{
                console.log('第几页了？',pages);
                if(data.status!==200){
                    res.json({
                        status:info.status,
                        msg:info.data.msg
                    });
                    return;
                }
                arr = arr.concat(JSON.parse(data.data));
                pages++;
            });
        }
        console.log('请求完了');
        res.json(arr);
    }).catch(e=>{
        res.json(e);
    })
})


module.exports = router;