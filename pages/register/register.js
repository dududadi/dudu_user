var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var qqMap = new QQMapWX({
    key: 'ZNWBZ-QJMCR-BLOWX-WAK34-EFEEF-B6FCT'
});

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        prov: '福建省',
        city: '福州市',
        area: '仓山区',
        tel: '',
        pwd: '',
        cfpwd: '',
        idNum: '',
        address: '',
        name: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        var userInfo = app.globalData.userInfo;

        var _this = this;

        wx.getLocation({
            success: function (res) {
                qqMap.reverseGeocoder({
                    location: {
                        latitude: res.latitude,
                        longitude: res.longitude
                    },
                    success: function (res) {
                        var component = res.result.address_component;

                        _this.setData({
                            prov: component.province,
                            city: component.city,
                            area: component.district
                        })
                    }
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    bindRegionChange: function (e) {
        this.setData({
            prov: e.detail.value[0],
            city: e.detail.value[1],
            area: e.detail.value[2]
        })
    },

    inputTel: function (e) {
        this.setData({
            tel: e.detail.value
        })
    },

    inputName: function (e) {
        this.setData({
            name: e.detail.value
        })
    },

    inputPwd: function (e) {
        this.setData({
            pwd: e.detail.value
        })
    },

    inputCfpwd: function (e) {
        this.setData({
            cfpwd: e.detail.value
        })
    },

    inputIdNum: function (e) {
        this.setData({
            idNum: e.detail.value
        })
    },

    inputAddress: function (e) {
        this.setData({
            address: e.detail.value
        })
    },

    //注册
    register: function () {
        if (this.data.tel == '' || this.data.pwd == '' || this.data.cfpwd == '' || this.data.idNum == '' || this.data.address == '' || this.data.name == '') {
            wx.showModal({
                title: '请检查输入',
                content: '部分输入有误，请重新再试'
            })
        } else if (this.data.pwd != this.data.cfpwd) {
            wx.showModal({
                title: '密码输入有误',
                content: '两次密码输入不一致，请重新再试'
            })
        } else {
            var userInfo = app.globalData.userInfo;

            var data = {
                prov: this.data.prov,
                city: this.data.city,
                area: this.data.area,
                tel: this.data.tel,
                pwd: this.data.pwd,
                idNum: this.data.idNum,
                address: this.data.address,
                name: this.data.name,
                openid: wx.getStorageSync('openid'),
                headImg: userInfo.avatarUrl,
                nickname: userInfo.nickName
            }

            wx.request({
                url: "https://www.forhyj.cn/miniapp/User/register",
                method: "POST",
                data: data,
                success: function (res) {
                    var data = res.data;

                    if (data == 0) {
                        wx.showModal({
                            title: '电话号码有误',
                            content: '电话号码格式不对，请重新再试'
                        })
                    } else if (data == 1) {
                        wx.showModal({
                            title: '密码有误',
                            content: '密码格式不对，请重新再试'
                        })
                    } else if (data == 2) {
                        wx.showModal({
                            title: '身份证有误',
                            content: '身份证号码格式不对，请重新再试'
                        })
                    } else if (data == 3) {
                        wx.showModal({
                            title: '该手机号已注册',
                            content: '请更换手机号后再试'
                        })
                    } else if (data == 4) {
                        wx.showModal({
                            title: '注册成功',
                            content: '恭喜您注册成功',
                            success: function(res) {
                                wx.redirectTo({
                                    url: '../index/index',
                                })
                            }
                        })
                    } else if (res == 5) {
                        wx.showModal({
                            title: '未知错误',
                            content: '请联系管理员'
                        })
                    }
                }
            })
        }
    }
})