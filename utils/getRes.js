import puppeteer from 'puppeteer';

async function getData(name){
    const browser = await (puppeteer.launch({
        //设置超时时间
        timeout: 15000,
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
    browser.close();

    return dateList;
}

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

async function getRepositories(url,browser){

}

export default name =>{
   return getData(name)
}
