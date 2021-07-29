# GetGithub
使用 puppeteer 根据Github用户名爬取个人commit过的日期以及当天commit的次数，还有爬取每一个公开的项目的url、项目名、commit数以及star数，拼接后返回json。

使用github api获取个人所有公开仓库以及每个仓库的contributions。

## 注意
Github api在没有授权直接访问的情况下，每个小时单IP限制60次，如果有授权的话没小时5000次，Github不允许将token上传到公开仓库，请自行在Github设置中生成个人token并将其放在axios的请求头中。

示例：
```js
const service = axios.create({
    baseURL:'https://api.github.com',
    headers: {
        get: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Authorization':"token 这里粘贴生成的token"
        },
        post: {
        'Content-Type': 'application/json;charset=utf-8'
        }
    },
    …………………………
)}
```
## 示例
调用例子：

请求个人所有的contributions：
> http://localhost:4000/getAllContributions/Magren0321  

请求个人信息：
> http://localhost:4000/getInfo/Magren0321  

请求个人仓库信息：
> http://localhost:4000/getRep/Magren0321

请求个人某个仓库的contribution信息：
> http://localhost:4000/getRepContributions/Magren0321/getGithub

# 最后
感谢[Github api](https://docs.github.com/en/rest/reference/repos#list-organization-repositories)