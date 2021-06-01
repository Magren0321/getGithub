import puppeteer from 'puppeteer';

async function getData(name){
    const browser = await (puppeteer.launch({
        //如果是访问https页面 此属性会忽略https错误
        ignoreHTTPSErrors: true,
        headless: true
    }));
    const page = await browser.newPage();
    await page.goto('https://github.com/'+name);
    const yearList =  await page.evaluate(()=>{
        //获取年份，以及对应contributions的url
        const year  = document.querySelectorAll(".filter-list > li > a");
        const yearlist = Array.prototype.map.call(year, (item) => {
            return {
                year: item.id.split('-')[2],
                href: item.href
            }
        });
        return yearlist;
    })
    //获取每一年里每天的contributions情况
    const dateList = [];
    for(let i of yearList){
        let date;
        await getDateList(i.href,browser).then(res=>{date = res});
        dateList.push({
            year: i.year,
            date: date
        });
    }
   const repList = await toRepositories(name,browser)
    // browser.close();

    return {
        dateList:dateList,
        repList:repList
    };
}
//获取日期以及当天的提交数
async function getDateList(yearData,browser){
    const page = await browser.newPage();
    await page.goto(yearData);
    const dateList = await page.evaluate(()=>{
        const date = document.querySelectorAll('.ContributionCalendar-day');
        const datelist = [];
        for(let item of date){
            if(item.getAttribute('data-count')!=0&&item.getAttribute('data-count')!=null){
                datelist.push({
                    data_date: item.getAttribute('data-date'),
                    data_count: item.getAttribute('data-count')
                })
            }
        }
      
        return datelist;
    })
    return dateList;
}

//获取所有项目的url
async function toRepositories(name,browser){
    const page = await browser.newPage();
    await page.goto('https://github.com/'+name+'?tab=repositories');
    let repositoriesUrl = [];
    let nextUrl = undefined;

    let rep = await getRep(page);

    if(rep.urlList!=undefined){
        for(let i of rep.urlList){
            repositoriesUrl.push(i);
        }
    }

    nextUrl = rep.nextUrl;

    while(nextUrl!=undefined){
        await page.goto(nextUrl);
        rep = await getRep(page);
        if(rep.urlList!=undefined){
            for(let i of rep.urlList){
                repositoriesUrl.push(i);
            }
        }

        nextUrl = rep.nextUrl;
    }
    
    let dataList = [];
    for(let i of repositoriesUrl){
        dataList.push(await getRepositoriesInfo(i,browser));
    }

    return dataList;

}


//获取当页的所有项目url
async function getRep(page){
        const rep =  await page.evaluate(()=>{
            const url = document.querySelectorAll('.wb-break-all > a');
            const next = document.querySelector('.BtnGroup > a');
            let urlList = undefined;
            let nextUrl = undefined;
            if(url != null){
                urlList = Array.prototype.map.call(url,(item)=>{
                    return item.href;
                })
            }
            if(next!=null&&next.outerText==='Next'){
                nextUrl = next.href;
            }
            return {
                urlList:urlList,
                nextUrl:nextUrl
            }
        });
        return rep;
}
//获取项目url，star数以及commit数
async function getRepositoriesInfo(url,browser){
    const page = await browser.newPage();
    await page.goto(url);
    const dataList = await page.evaluate(()=>{
        const name = document.querySelectorAll('strong.mr-2.flex-self-stretch > a')[0].outerText;
        const star = document.querySelectorAll('a.social-count.js-social-count')[0].getAttribute('aria-label').split(' ')[0];
        const commit = document.querySelectorAll('span.d-none.d-sm-inline > strong')[0].outerText;

        return data = {
            name: name,
            star: star,
            commit :commit
        }
    })
    dataList.url = url;
    return dataList;
}

export default name =>{
   return getData(name)
}
