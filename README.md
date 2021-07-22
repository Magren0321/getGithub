# GetGithub
使用 puppeteer 根据Github用户名爬取个人commit过的日期以及当天commit的次数，还有爬取每一个公开的项目的url、项目名、commit数以及star数，拼接后返回json。

使用github api获取个人所有公开仓库以及每个仓库的contributions。

调用例子：
> http://localhost:4000/getAllContributions/Magren0321

返回示例:  

![](./img/test.png)