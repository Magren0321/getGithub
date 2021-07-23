import axios from './index';

//github api文档：https://docs.github.com/en/rest/reference/repos#list-organization-repositories

const request = {
    /**
     * 获取github用户的个人信息
     * @param {string} name 
     * @returns 
     */
    getInfo(name){
        return axios({
            url:'/users/'+name,
            method:'get'
        })
    },
    /**
     * 获取个人所有公开的项目
     * @param {string} name 
     * @param {number} page 页数，一页最多只能获取100个仓库，当获取到的仓库数量是100时，理应翻下一页判断是否还有
     * @returns 
     */
    getRep(name,page){
        return axios({
            url:'/users/'+name+'/repos?page='+page+'&per_page=100&sort=updated',
            method:'get'
        })
    },
    /**
     * 获取用户指定仓库下的contributions数
     * @param {string} userName 
     * @param {string} repName 
     * @returns 
     */
    getRepContributions(userName,repName){
        return axios({
            url:'/repos/'+userName+'/'+repName+'/contributors',
            method:'get'
        })
    }
}

export default request;