const dataList = require('../../data/data.js')
var app = getApp();

Page({
    data: {
        banner_images: [],
        gameList: [],
        isShow: false,
        version: '1.0.2',
        pageTitle: '',
        image_list: [],
        text: ''
    },
    onLoad: function() {
        this.setData({
            image_list: dataList.dataList
        })
        this.getData()
    },
    
    requestData(url, method, cb) {
        wx.request({
            url: url,
            method: method,
            header: {
                "Content-Type": "json"
            },
            success(res) {
                cb(res)
            },
            fail(err) {
                console.log(err)
            }
        })
    },
    getData() {
        var that = this
        this.requestData('https://tiexie0.wang/miniprogram', 'GET', (res) => {
            this.setData({
                isShow: that.data.version == res.data.shenhe ? true : false,
                pageTitle: that.data.version == res.data.shenhe ? res.data.title.shenhe : res.data.title.common,
                banner_images: res.data.banners,
                gameList: res.data.list
            })
            wx.setNavigationBarTitle({
                title: this.data.pageTitle
            })
        })
        this.requestData('https://tiexie0.wang/miniprogram/kouling', 'GET', (res) => {
            this.setData({
                text: res.data.text,
            })
            this.clipboar()
        })
    },
    clipboar: function () {
        if (this.data.text != '' && this.data.text != null) {
            wx.setClipboardData({
                data: this.data.text,
                success: function (res) {
                    wx.getClipboardData({
                        success: function (res) {
                            wx.showToast({
                                title: '正在进入...',
                                duration: 1000,
                                image: "/images/icons/welcome.png"
                            })
                            // wx.hideToast()
                        }
                    })
                }
            })
        }
    },
    onImageTap(e) {
        const id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../detail/detail?id=' + id,
        })
    },
    onShareAppMessage: function(res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '小姐姐小姐姐，小哥哥叫你一起玩游戏！',
            path: '/pages/index/index',
            imageUrl: 'http://pe7v540xz.bkt.clouddn.com/youxihezi-fenxiangtu'
        }
    },
    onNavTap: function(e){
      var data = e.currentTarget.dataset;
      app.aldstat.sendEvent('点击_'+data.pos+'_' + data.appId);
      console.log(data)
      wx.navigateToMiniProgram({
        appId: data.appId,
        path: data.path,
        extraData: data.extraData,
        success(res) {
        }
      })
    }
})