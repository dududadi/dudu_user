var amapFile = require('../../libs/amap-wx.js');
var myAmapFun = new amapFile.AMapWX({ key: '19ea604f2c70652cfafbe4843a5ac736' });

Page({
    /**
     * 页面的初始数据
     */
    data: {
        itv: '',
        markers: [],
        distance: '司机离你还有 0 米',
        cost: '',
        polyline: [],
        textData: {},
        longitude: '',
        latitude: '',
        location: '',
        inCarInfo: ''
    },
    makertap: function (e) {
        var id = e.markerId;
        var that = this;
        that.showMarkerInfo(markersData, id);
        that.changeMarkerColor(markersData, id);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        this.getMyLocation();

        wx.request({
            url: 'https://www.forhyj.cn/miniapp/User/getOrderId',
            data: {
                openid: wx.getStorageSync('openid'),
                driverid: wx.getStorageSync('driverId')
            },
            method: 'POST',
            success: function (res) {
                var data = res.data;

                wx.setStorageSync('orderId', res.data);

                that.paintMap();
                that.data.itv = setInterval(that.paintMap, 2000);
            }
        })


    },
    showMarkerInfo: function (data, i) {
        var that = this;
        that.setData({
            textData: {
                name: data[i].name,
                desc: data[i].address
            }
        });
    },
    changeMarkerColor: function (data, i) {
        var that = this;
        var markers = [];
        for (var j = 0; j < data.length; j++) {
            if (j == i) {
                data[j].iconPath = "../../imgs/mark_bs.png"; //如：..­/..­/img/marker_checked.png
            } else {
                data[j].iconPath = "../../imgs/mark_bs.png"; //如：..­/..­/img/marker.png
            }
            markers.push(data[j]);
        }

        that.setData({
            markers: markers
        });
    },

    //调用wx接口 获取用户当前的实时信息
    getMyLocation: function () {
        var that = this;

        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                that.setData({
                    longitude: res.longitude,
                    latitude: res.latitude,
                    location: res.longitude + ',' + res.latitude
                })
            }
        })
    },

    //地图绘制
    paintMap() {
        var that = this;

        this.getMyLocation();

        wx.request({
            url: 'https://www.forhyj.cn/miniapp/User/getDriverLocation',
            method: 'POST',
            data: {
                longitude: that.data.longitude,
                latitude: that.data.latitude,
                openid: wx.getStorageSync('openid'),
                driverid: wx.getStorageSync('driverId'),
                orderId: wx.getStorageSync('orderId')
            },
            success: function (res) {
                var data = res.data;

                if (data.ols_id == 2) {
                    that.setData({
                        itv: clearInterval(that.data.itv)
                    })

                    that.inCar();
                    that.data.itv = setInterval(that.inCar, 5000);
                } else {
                    var driverLocation = data.dl_longitude + ',' + data.dl_latitude;

                    that.setData({
                        markers: [{
                            iconPath: "../../imgs/marker.png",
                            latitude: that.data.latitude,
                            longitude: that.data.longitude,
                            width: 23,
                            height: 33
                        }, {
                            iconPath: "../../imgs/marker.png",
                            latitude: Number(data.dl_latitude),
                            longitude: Number(data.dl_longitude),
                            width: 23,
                            height: 33
                        }]
                    })

                    myAmapFun.getDrivingRoute({
                        origin: that.data.location,
                        destination: driverLocation,
                        success: function (data) {
                            var points = [];
                            if (data.paths && data.paths[0] && data.paths[0].steps) {
                                var steps = data.paths[0].steps;
                                for (var i = 0; i < steps.length; i++) {
                                    var poLen = steps[i].polyline.split(';');
                                    for (var j = 0; j < poLen.length; j++) {
                                        points.push({
                                            longitude: parseFloat(poLen[j].split(',')[0]),
                                            latitude: parseFloat(poLen[j].split(',')[1])
                                        })
                                    }
                                }
                            }

                            that.setData({
                                polyline: [{
                                    points: points,
                                    color: "#0091ff",
                                    width: 6
                                }],
                                distance: '司机离你还有 ' + data.paths[0].distance + ' 米'
                            });
                        }
                    })
                }
            }
        })
    },

    //实时路径绘制
    inCar: function () {
        var that = this;

        var data = {
            orderId: wx.getStorageSync('orderId')
        }

        wx.request({
            url: 'https://www.forhyj.cn/miniapp/User/getWayArr',
            method: 'POST',
            data: data,
            success: function (res) {
                var data = res.data;

                console.log(data)

                if (data.wayArr.length > 0) {
                    that.setData({
                        polyline: [{
                            points: data.wayArr,
                            color: "#0091ff",
                            width: 6
                        }],
                        markers: [{
                            iconPath: "../../imgs/marker.png",
                            latitude: Number(data.wayArr[data.wayArr.length - 1].latitude),
                            longitude: Number(data.wayArr[data.wayArr.length - 1].longitude),
                            width: 23,
                            height: 33
                        }],
                        distance: '已上车',
                        inCarInfo: '路程： ' + data.len + ' km'
                    });
                } else {
                    that.setData({
                        polyline: [{
                            points: data.wayArr,
                            color: "#0091ff",
                            width: 6
                        }],
                        markers: [],
                        distance: '已上车',
                        inCarInfo: '路程： ' + (data.len / 1000).toFixed(2) + ' km'
                    });
                }

                if (data.cost == data.low) {
                    that.setData({
                        cost: '当前出行金额： ' + data.cost + ' 元（最低消费）'
                    })
                } else {
                    that.setData({
                        cost: '当前出行金额： ' + data.cost + ' 元'
                    })
                }

                if (data.status == 4) {
                    that.setData({
                        itv: clearInterval(that.data.itv)
                    })
                }
            }
        })
    }
})
