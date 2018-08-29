const dataList = require('../../data/data.js')
//获取应用实例
const app = getApp()

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        getUserInfoFail: false,
        banner_images: [],
        gameList: [],
        isShow: true,
        version: '1.0',
        pageTitle: '',
        image_list: []
    },
    onShow: function() {
        this.login();
        this.getData()
    },
    onLoad: function() {
        this.checkLogin()
        this.setData({
            image_list: dataList.dataList
        })
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
        this.requestData('https://tiexie0.wang/adzone/program', 'GET', (res) => {
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
    },
    checkLogin() {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                app.globalData.userInfo = res.userInfo
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                },
                fail: res => {
                    this.setData({
                        getUserInfoFail: true
                    })
                }
            })
        }
    },
    getUserInfo: function(e) {
        if (e.detail.userInfo) {
            app.globalData.userInfo = e.detail.userInfo
            this.setData({
                userInfo: e.detail.userInfo,
                hasUserInfo: true
            })
        } else {
            this.openSetting();
        }
    },
    login: function() {
        var that = this
        wx.login({
            success: function(res) {
                var code = res.code;
                wx.getUserInfo({
                    success: function(res) {
                        app.globalData.userInfo = res.userInfo
                        that.setData({
                            getUserInfoFail: false,
                            userInfo: res.userInfo,
                            hasUserInfo: true
                        })
                    },
                    fail: function(res) {
                        that.setData({
                            getUserInfoFail: true
                        })
                    }
                })
            }
        })
    },
    openSetting: function() {
        var that = this
        if (wx.openSetting) {
            wx.openSetting({
                success: function(res) {
                    //尝试再次登录
                    that.login()
                }
            })
        } else {
            wx.showModal({
                title: '授权提示',
                content: '小程序需要您的微信授权才能使用哦~ 错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权按钮'
            })
        }
    },
    onImageTap(e) {
        const id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../detail/detail?id=' + id,
        })
    }
})