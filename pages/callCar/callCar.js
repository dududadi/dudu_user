var amapFile = require('../../libs/amap-wx.js');
var myAmapFun = new amapFile.AMapWX({ key: '19ea604f2c70652cfafbe4843a5ac736' });   //接入高德地图
var lonlat;
var city;

Page({
    data: {    
        tips1: {},  //起点的搜索结果
        tips2: {},  //终点的搜索结果
        start: "",  //起点名字
        end: "",    //终点名字
        carType: "",    //车类型
        startLocation: {    //起始位置
            latitude: '',
            longitude: ''
        },
        endLocation: {      //终点位置
            latitude: '',
            longitude: ''
        },  
        itv: '',    //轮询变量
        distance: 0,    //距离
        hideAtt: 'hideAtt',     //隐藏标签的类
        clock: '0:00',      //时钟
        second: 0       //秒
    },    
    onLoad: function (e) {
        lonlat = e.lonlat;
        city = e.city;
        this.setData({
            carType: wx.getStorageSync('carType')
        })
    },
    /**
   * 生命周期函数--监听页面卸载
   */
    onUnload: function () {
        this.rmOrder();
    },
    bindInput: function (e) {
        var that = this;
        var keywords = e.detail.value;
        var local = e.target.dataset.local;

        myAmapFun.getInputtips({
            keywords: keywords,
            location: lonlat,
            city: city,
            success: function (data) {
                if (data && data.tips) {
                    if (local == "start") {
                        if (data.tips[0].location == undefined) {
                            that.setData({
                                tips1: {}
                            });
                        } else {
                            that.setData({
                                tips1: data.tips,
                            });
                        }
                    } else if (local == "end") {
                        if (data.tips[0].location == undefined) {
                            that.setData({
                                tips2: {}
                            });
                        } else {
                            that.setData({
                                tips2: data.tips
                            });
                        }
                    }
                }
            }
        })
    },
    bindSearch: function (e) {
        var that = this;
        var keywords = e.target.dataset.keywords;
        var local = e.target.dataset.local;
        var location = e.target.dataset.location.split(',');

        if (local == "start") {
            that.setData({
                start: keywords,
                tips1: {},
                tips2: {},
                startLocation: {
                    longitude: location[0],
                    latitude: location[1]
                }
            });
        } else if (local == "end") {
            that.setData({
                end: keywords,
                tips1: {},
                tips2: {},
                endLocation: {
                    longitude: location[0],
                    latitude: location[1]
                }
            });
        }
    },
    callCarBtn: function () {
        if (this.data.start == '' || this.data.end == '') {
            wx.showModal({
                title: '请检查输入',
                content: '起点或终点未输入'
            })
        } else {
            var that = this;

            myAmapFun.getDrivingRoute({
                origin: that.data.startLocation.longitude + ',' + that.data.startLocation.latitude,
                destination: that.data.endLocation.longitude + ',' + that.data.endLocation.latitude,
                success: function (data) {
                    that.setData({
                        distance: data.paths[0].distance
                    });
                }
            })

            this.setData({
                hideAtt: ''
            })

            this.data.itv = setInterval(this.getDriver, 1000);
        }
    },
    getDriver: function () {
        var that = this;

        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                var myLongitude = res.longitude;
                var myLatitude = res.latitude;

                that.createClock();

                var data = {
                    openid: wx.getStorageSync('openid'),
                    start: that.data.start,
                    end: that.data.end,
                    startLongitude: that.data.startLocation.longitude,
                    startLatitude: that.data.startLocation.latitude,
                    endLongitude: that.data.endLocation.longitude,
                    endLatitude: that.data.endLocation.latitude,
                    carType: that.data.carType,
                    distance: that.data.distance,
                    myLongitude: myLongitude,
                    myLatitude: myLatitude
                }

                wx.request({
                    url: "https://www.forhyj.cn/miniapp/User/checkHandUp",
                    data: data,
                    method: "POST",
                    success: function (res) {
                        var data = res.data;
                        console.log(data);

                        if (data.status_code == 0 || data.status_code == 3) {
                            //未超时

                        } else if (data.status_code == 1) {
                            //过时

                            that.rmOrder();

                            wx.showModal({
                                title: '超过三分钟无人接单',
                                content: '已自动取消订单'
                            })
                        } else if (data.status_code = 2) {
                            //接到单
                            that.setData({
                                hideAtt: 'hideAtt',
                                itv: clearInterval(that.data.itv),
                                second: 0,
                                clock: "0:00"
                            })

                            wx.setStorageSync('driverId', data.driv_id);

                            wx.redirectTo({
                                url: '../map/map'
                            }) 
                        }
                    }
                })
            }
        })
    },
    rmOrder: function () {
        var that = this;

        this.setData({
            hideAtt: 'hideAtt',
            itv: clearInterval(that.data.itv),
            second: 0,
            clock: "0:00"
        })

        var data = {
            openid: wx.getStorageSync('openid')
        }

        wx.request({
            url: "https://www.forhyj.cn/miniapp/User/rmOrder",
            data: data,
            method: "POST"
        })
    },
    createClock: function () {
        var sec = this.data.second;

        sec++;

        this.setData({
            second: sec
        })

        var min = parseInt(sec / 60);
        sec %= 60;

        if (sec == 0) {
            sec == '00';
        } else if (sec / 10 < 1) {
            sec = '0' + sec;
        }

        var clock = min + ':' + sec;

        this.setData({
            clock: clock
        })
    }
})