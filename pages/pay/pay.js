Page({
    data:{
        // 计算支付余额
        orderId:0,
        total: 0,
        dprice: 0,
        tprice: 0,
        stime: '',
        etime: '',
        len: 0,
        low:0,
        cost:0,
        // 支付
        balance: 100,//余额
        actual_fee: 20,//待支付
        wallets_password_flag: false,//密码输入遮罩
        psw:''
    },
    onLoad: function (e) {
        this.setPayInfo();
    },
    //支付
    openInputPsw: function () {
        var money = this.data.cost;
        var _this = this;
        wx.request({
            url: "https://www.forhyj.cn/miniapp/User/checkMoney",
            data: {
                money: money,
                openid: wx.getStorageSync('openid')
            },
            method: "POST",
            success: function (res) {
                if(res.data){
                    _this.setData({
                        wallets_password_flag: true,
                    })
                }else{
                    wx.showModal({
                        title: '钱包提醒',
                        content: '您的余额不足，请充值！',
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定');
                                wx.navigateTo({
                                    url: '../wallet/wallet'
                                })
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                }
            }
        })
       
    },
    inputPsw: function (e) {
        this.setData({
            psw: e.detail.value
        })
    },
    conPay:function(){
        var psw = this.data.psw;
        var money = this.data.cost;
        wx.request({
            url: "https://www.forhyj.cn/miniapp/User/checkPsw",
            data: { 
                psw: psw,
                openid: wx.getStorageSync('openid'),
                money: money,
                driverid: wx.getStorageSync('driverId'),
                orderId: wx.getStorageSync('orderId')
            },
            method: "POST",
            success: function (res) {
                console.log(res);
                if(res.data==1){
                    
                    wx.showModal({
                        title: '支付成功',
                        content: '确认前往订单页面，取消则返回首页！',
                        success: function (res) {
                            console.log(res);
                            if (res.confirm) {
                                console.log('确认前往订单页面');
                                wx.redirectTo({
                                    url: '../order/order?openid=' + wx.getStorageSync('openid')
                                })
                            } else if (res.cancel) {
                                console.log('取消则返回首页')
                                wx.redirectTo({
                                    url: '../main/main'
                                })
                            }
                        }
                    });
                } else if (res.data == 2 || res.data == 3) {
                    wx.showModal({
                        title: '支付失败',
                        content: '余额不足，是否前往充值',
                        success: function (res) {
                            if (res.confirm) {
                                console.log('确认前往充值页面');
                                wx.redirectTo({
                                    url: '../wallet/wallet'
                                })
                            } else if (res.cancel) {
                                console.log('取消留在当前页')
                            }
                        }
                    })
                }else {
                    wx.showModal({
                        title: '支付失败',
                        content: '密码错误，请重新输入'
                    })
                }
            }
        })
    },
    close_wallets_password() {//关闭钱包输入密码遮罩
        this.setData({
            isFocus: false,//失去焦点
            wallets_password_flag: false,
        })
    },
    //结算并显示金额
    setPayInfo:function(){
        this.setData({
            orderId: wx.getStorageSync('orderId')
        })
        console.log(this.data.orderId);
        var that = this;
        wx.request({
            url: "https://www.forhyj.cn/miniapp/User/setPayInfo",
            data: { orderId: that.data.orderId },
            method: "POST",
            success: function (res) {
                console.log(res);
                var dprice = res.data.ol_km_price;
                var etime = res.data.ol_end_time;
                var stime = res.data.ol_start_time;
                var tprice = res.data.ol_time_price;
                var cost = res.data.cost;
                var len = res.data.ol_km_num;
                var low = res.data.low;
                that.setData({
                    dprice: dprice,
                    tprice: tprice,
                    stime: stime,
                    etime: etime,
                    len: len,
                    low: low,
                    cost: cost
                })
            }
        })
    }
    

})