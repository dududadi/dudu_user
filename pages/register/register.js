var QQMapWX = require('../../js/qqmap-wx-jssdk.min.js');
var qqMap = new QQMapWX({
    key: 'ZNWBZ-QJMCR-BLOWX-WAK34-EFEEF-B6FCT'
});

Page({

    /**
     * 页面的初始数据
     */
    data: {
        prov: '福建省',
        city: '福州市',
        aera: '仓山区',
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
                            aera: component.district
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    bindRegionChange: function (e) {
        console.log(e.detail)

        // this.setData({
        //     prov: e.detail.value[0],
        //     city: e.detail.value[2],
        //     aera: e.detail.value[3]
        // })
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
        }
    }
})