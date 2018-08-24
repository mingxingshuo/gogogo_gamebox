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
        videoList: [
            {
                title: '慧慧广场舞《笑脸》原创教学',
                link: 'http://111.202.34.132/aucwx.tangdou.com/201808/EB1FDD1F1B4C280C7BE698ED2249240F-20.mp4',
                img: 'http://wxsnsdythumb.wxs.qq.com/109/20204/snsvideodownload?m=72bbba68f6d8d0ad0cdf7005bbea8cd9&filekey=30340201010420301e02016d04025348041072bbba68f6d8d0ad0cdf7005bbea8cd90203011800040d00000004627466730000000131&hy=SH&storeid=32303138303832333038333934373030303037653537313336666664393337303561333230613030303030303664&bizid=1023'
            },
            {
                title: '广场舞《蓝色天梦》简单藏族舞',
                link: 'http://111.202.34.132/aucwx.tangdou.com/201808/DEACD2D272D3513C032BA0FC585A2B72-20.mp4',
                img: 'http://wxsnsdythumb.wxs.qq.com/109/20204/snsvideodownload?m=72bbba68f6d8d0ad0cdf7005bbea8cd9&filekey=30340201010420301e02016d04025348041072bbba68f6d8d0ad0cdf7005bbea8cd90203011800040d00000004627466730000000131&hy=SH&storeid=32303138303832333038333934373030303037653537313336666664393337303561333230613030303030303664&bizid=1023'
            },
            {
                title: '新风尚《我的唇吻不到我的爱人》简单32步时尚步子舞',
                link: 'http://111.202.34.132/aucwx.tangdou.com/201808/CDC09534212746D67CE5BEB730D11277-20.mp4'
            },
            {
                title: '飘飘范《我在断桥等你》零基础入门简单八步鬼步舞',
                link: 'http://111.202.34.132/aucwx.tangdou.com/201808/AD5E2023-74CF-FE49-1327-0A8065C6FF7D-20.mp4'
            }
        ]
    },
    onShow: function () {
        this.login();
        this.getData()
    },
    onLoad: function () {
        this.checkLogin()
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
            console.log(res)
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
    getUserInfo: function (e) {
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
    login: function () {
        var that = this
        wx.login({
            success: function (res) {
                var code = res.code;
                wx.getUserInfo({
                    success: function (res) {
                        app.globalData.userInfo = res.userInfo
                        that.setData({
                            getUserInfoFail: false,
                            userInfo: res.userInfo,
                            hasUserInfo: true

                        })
                    },
                    fail: function (res) {
                        console.log(res);
                        that.setData({
                            getUserInfoFail: true
                        })
                    }
                })
            }
        })
    },
    openSetting: function () {
        var that = this
        if (wx.openSetting) {
            wx.openSetting({
                success: function (res) {
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
    }
})