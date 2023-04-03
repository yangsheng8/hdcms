import { defineStore } from 'pinia'
import { Cloud } from 'laf-client-sdk'
import { LOGIN_TOKEN } from '@/global/constants'
import { localCache } from '@/utils/cache'

const cloud = new Cloud({
  baseUrl: 'https://xjd82y.laf.dev',
  getAccessToken: () => localCache.getCache(LOGIN_TOKEN),
  timeout: 60000
})

const useHomeStore = defineStore('login', {
  state: () => ({
    beforeTitle: '', //用户输入的标题
    titleLimit: 0, // 标题字数
    keyword: '', // 主关键词
    language: '', // 语言
    consult: '', //参考
    AfterTile: '', //存入新标题
    fivedes: '', // 五点描述
    fiveDesLimit: 0, // 五点描述长度
    newFivedes: [1, 2, 3, 4, 5], //自定义五点描述
    longdes: '', // 长描述
    longdecLimit: 0, // 长描述字数限制
    bgkeywords: '', // 后台关键词
    bgkeywordsLimit: 0, // 后台关键词字数限制
    globalLoading: false,
    titleBtnLoading: false,
    fivedesBtnLoading: false,
    longBtnLoading: false,
    gbKeywordsBtnLoading: false
  }),
  actions: {
    async send(message) {
      let res
      try {
        // 我们提问的内容
        res = await cloud.invoke('send', { message })
        return res.text
      } catch (error) {
        console.log(error)
        return '出错了，请重试！'
      }
    },
    async oneOfAllAction(obj) {
      this.beforeTitle = obj.title
      this.titleLimit = obj.titleLimit
      this.keyword = obj.keyword
      this.language = obj.language
      this.consult = obj.consult
      this.fivedes = obj.fivedes
      this.fiveDesLimit = obj.fiveDesLimit
      this.longdes = obj.longdes
      this.longdecLimit = obj.longdecLimit
      this.bgkeywords = obj.bgkeywords
      this.bgkeywordsLimit = obj.bgkeywordsLimit

      const p1 = this.titleChangeAction(
        this.beforeTitle,
        this.titleLimit,
        this.keyword,
        this.language,
        this.consult
      )
      const p2 = this.fiveDesChangeAction(
        this.beforeTitle,
        this.fiveDesLimit,
        this.keyword,
        this.language,
        this.consult
      )
      const p3 = this.longDesChangeAction(
        this.beforeTitle,
        this.longdecLimit,
        this.keyword,
        this.language,
        this.consult
      )
      const p4 = this.bgKeywordsChangeAction(
        this.beforeTitle,
        this.bgkeywordsLimit,
        this.keyword,
        this.language,
        this.consult
      )
      Promise.all([p1, p2, p3, p4]).then((res) => {
        console.log('all promise res:', res)
      })
    },
    //自动生成标题
    async titleChangeAction(...message) {
      this.globalLoading = true
      //1. 把message传给chatGPT转化后返回 存到 afterTitle
      let mes = ''
      if (message[0]) {
        mes = `请优化这段文字${message[0]}符合${message[4]}的标题，字数限制在${message[1]}，输出语言是${message[3]}`
        if (message[2]) {
          mes = `请优化这段文字${message[0]},加入这些关键词:${message[2]},符合${message[4]}的标题，字数限制在${message[1]}，输出语言是${message[3]}`
        }
      }

      let res = await this.send(mes)
      if (res) {
        this.AfterTile = res
        this.globalLoading = false
      }
    },
    //手动生成标题
    async titleHandChangeAction(infoObj) {
      this.titleBtnLoading = true
      //1. 把message传给chatGPT转化后返回 存到 afterTitle
      let mes = ''
      if (infoObj) {
        mes = `请根据这些关键词“${infoObj.keywords}”生成符合${infoObj.consult}的标题，字数限制在${infoObj.titleLimit}，输出语言是${infoObj.language}`
      }
      let res = await this.send(mes)
      if (res) {
        this.AfterTile = res
        this.titleBtnLoading = false
      }
    },
    //自动生成五点描述
    async fiveDesChangeAction(...message) {
      this.globalLoading = true
      //1. 把message传给chatGPT转化后返回 存到 fivedes
      let mes = ''
      if (message[0]) {
        mes = `请根据这个标题${message[0]}生成符合${message[4]}的5点描述，每条描述的长度限制在${message[1]}，输出语言是${message[3]}`
        if (message[2]) {
          mes = `请根据这个标题${message[0]}和这些关键词${message[2]}，生成符合${message[4]}的5点描述，每条描述的长度限制在${message[1]}，输出语言是${message[3]}`
        }
      }

      let res = await this.send(mes)
      if (res) {
        this.fivedes = res
        this.globalLoading = false
      }
    },
    //手动生成五点描述
    async fivedesHandChangeAction(infoObj) {
      this.newFivedes = []
      this.fivedesBtnLoading = true
      //1. 把message传给chatGPT转化后返回 存到 newFivedes
      if (infoObj.kwData1) {
        let mes = `请根据这些关键词“${infoObj.kwData1}”生成符合${infoObj.consult}的标题，字数限制在${infoObj.textLimit}，输出语言是${infoObj.language}`
        let res = await this.send(mes)
        if (res) {
          this.newFivedes.push(res)
        }
      }
      if (infoObj.kwData2) {
        let mes = `请根据这些关键词“${infoObj.kwData2}”生成符合${infoObj.consult}的标题，字数限制在${infoObj.textLimit}，输出语言是${infoObj.language}`
        let res = await this.send(mes)
        if (res) {
          this.newFivedes.push(res)
        }
      }
      if (infoObj.kwData3) {
        let mes = `请根据这些关键词“${infoObj.kwData3}”生成符合${infoObj.consult}的标题，字数限制在${infoObj.textLimit}，输出语言是${infoObj.language}`
        let res = await this.send(mes)
        if (res) {
          this.newFivedes.push(res)
        }
      }
      if (infoObj.kwData4) {
        let mes = `请根据这些关键词“${infoObj.kwData4}”生成符合${infoObj.consult}的标题，字数限制在${infoObj.textLimit}，输出语言是${infoObj.language}`
        let res = await this.send(mes)
        if (res) {
          this.newFivedes.push(res)
        }
      }
      if (infoObj.kwData5) {
        let mes = `请根据这些关键词“${infoObj.kwData5}”生成符合${infoObj.consult}的标题，字数限制在${infoObj.textLimit}，输出语言是${infoObj.language}`
        let res = await this.send(mes)
        if (res) {
          this.newFivedes.push(res)
        }
      }
      if (this.newFivedes.length > 0) {
        this.fivedesBtnLoading = false
      }
    },
    async longDesChangeAction(...message) {
      this.globalLoading = true
      //1. 把message传给chatGPT转化后返回 存到 afterTitle
      let mes = ''
      if (message[0]) {
        mes = `请根据这个标题${message[0]}生成符合${message[4]}的描述，字数限制在${message[1]}，输出语言是${message[3]}`
        if (message[2]) {
          mes = `请根据这个标题${message[0]}和这些关键词${message[2]}，生成符合${message[4]}的描述，字数长度限制在${message[1]}，输出语言是${message[3]}`
        }
      }

      let res = await this.send(mes)
      if (res) {
        this.longdes = res
        this.globalLoading = false
      }
    },
    //手动生成长描述
    async longHandChangeAction(infoObj) {
      this.longBtnLoading = true
      //1. 把message传给chatGPT转化后返回 存到 longdes
      let mes = ''
      if (infoObj) {
        mes = `请根据这些关键词“${infoObj.keywords}”生成符合${infoObj.consult}的长描述，字数限制在${infoObj.textLimit}，输出语言是${infoObj.language}`
      }
      let res = await this.send(mes)
      if (res) {
        this.longdes = res
        this.longBtnLoading = false
      }
    },
    async bgKeywordsChangeAction(...message) {
      this.globalLoading = true
      //1. 把message传给chatGPT转化后返回 存到 bgkeywords
      let mes = ''
      if (message[0]) {
        mes = `请根据这个标题${message[0]}生成符合${message[4]}的后台关键词，字数限制在${message[1]}，输出语言是${message[3]}`
        if (message[2]) {
          mes = `请根据这个标题${message[0]}和这些关键词${message[2]}，生成符合${message[4]}的后台关键词，字数长度限制在${message[1]}，输出语言是${message[3]}`
        }
      }

      let res = await this.send(mes)
      if (res) {
        this.bgkeywords = res
        this.globalLoading = false
      }
    },
    //手动生成后台关键词
    async bgKeywordsdHandChangeAction(infoObj) {
      this.gbKeywordsBtnLoading = true
      //1. 把message传给chatGPT转化后返回 存到 bgkeywords
      let mes = ''
      if (infoObj) {
        mes = `请根据这些关键词“${infoObj.keywords}”生成符合${infoObj.consult}的后台关键词，字数限制在${infoObj.textLimit}，输出语言是${infoObj.language}`
      }
      let res = await this.send(mes)
      if (res) {
        this.bgkeywords = res
        this.gbKeywordsBtnLoading = false
      }
    }
  }
})

export default useHomeStore
