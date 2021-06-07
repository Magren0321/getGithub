/**
 * 爬取用户在github上提交过的日期以及当天提交的次数，根据年份分类，以及followers数
 */
async function getContribution(name,browser){
    const page = await browser.newPage();
    await page.goto('https://github.com/'+name);

    const list =  await page.evaluate(()=>{
        
        // //获取followers数
        // const div = document.querySelectorAll('.mb-3 > a');
        // const reg = /followers/ //正则表达式，取有followers的字符串
        // let followers = undefined;
        // for(let i of div){
        //     if(reg.test(i.href)){
        //         followers = i.querySelector('span').outerText;
        //     }
        // }
        
        //获取年份，以及对应contributions的url
        const year  = document.querySelectorAll(".filter-list > li > a");
        const yearlist = Array.prototype.map.call(year, (item) => {
            return {
                year: item.id.split('-')[2],
                href: item.href
            }
        });

        return {
            yearList: yearlist
        };
    })

    //获取每一年里每天的contributions情况
    const dateList = [];
    for(let i of list.yearList){
        let date;
        await getDateList(i.href,page).then(res=>{date = res});
        dateList.push({
            year: i.year,
            date: date
        });
    }

    return {
        dateList:dateList,
    }
}

//获取日期以及当天的提交数
async function getDateList(yearData,page){
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

export default(name,browser)=>{
    return getContribution(name,browser);
}