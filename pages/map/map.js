var amapFile = require('../../libs/amap-wx.js');
var myAmapFun = new amapFile.AMapWX({ key: '19ea604f2c70652cfafbe4843a5ac736' });
var markersData = []

Page({
    /**
     * 页面的初始数据
     */
    data: {
        itv: '',
        markers: [{
            iconPath: "../../imgs/marker.png",
            id: 0,
            latitude: 29.989643,
            longitude: 116.481028,
            width: 23,
            height: 33
        }, {
            iconPath: "../../imgs/marker.png",
            id: 0,
            latitude: '',
            longitude: '',
            location: '',
            width: 23,
            height: 33
        }],
        distance: '',
        cost: '',
        polyline: [],
        textData: {},
        longitude: '',
        latitude: '',
        location: ''
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
                console.log(data)

                wx.setStorageSync('orderId', res.data);

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
    getMyLocation: function () {
        var that = this;

        wx.getLocation({
            success: function (res) {
                that.setData({
                    longitude: res.longitude,
                    latitude: res.latitude,
                    location: res.longitude + ',' + res.latitude
                })
            }
        })
    },
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

                console.log(data)

                var driverLocation = data.dl_longitude + ',' + data.dl_latitude;

                that.setData({
                    markers: [{
                        iconPath: "../../imgs/marker.png",
                        id: 0,
                        latitude: that.data.longitude,
                        longitude: that.data.latitude,
                        width: 23,
                        height: 33
                    }, {
                        iconPath: "../../imgs/marker.png",
                        id: 0,
                        latitude: data.dl_longitude,
                        longitude: data.dl_latitude,
                        location: that.data.location,
                        width: 23,
                        height: 33
                    }],
                    distance: data.paths[0].distance
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
                            }]
                        });
                    }
                })
            }
        })
    }
})
