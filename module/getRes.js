import getRep from './getRepositories';
import getContribution from './getContributions';
import puppeteer from 'puppeteer';

async function getData(name){
    const browser = await (puppeteer.launch({
        args: ['--no-sandbox', 
        '--disable-setuid-sandbox'],
        //如果是访问https页面 此属性会忽略https错误
        ignoreHTTPSErrors: true,
        headless: true //改为true则不会显示浏览器
    }));
    
    const contribution = await getContribution(name,browser);

    // const repList = await getRep(name,browser) 
    
    browser.close();

    return {
        dateList:contribution.dateList,
        followers:contribution.followers
    };
}


export default name =>{
   return getData(name)
}
