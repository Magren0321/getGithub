/**
 * 爬取用户的所有公开项目的名称，url，以及star数和commit数
 * 由于Github api可以获取项目情况，故不用此部分爬虫（因为实在是太慢了……
 * Github api：https://api.github.com/users/Magren0321
 */

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
    
    await page.close()
    return dataList
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

    await page.close()

    return dataList;
}



 export default (name,browser) =>{
    return toRepositories(name,browser)
 }
 