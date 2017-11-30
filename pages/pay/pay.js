Page({
    data:{
        orderId:0,
        total: 0,
        dprice: 0,
        tprice: 0,
        stime: '',
        etime: '',
        len: 0,
        low:''
    },
    onLoad: function (e) {
        setPayInfo();
    },
    setPayInfo:function(){
        that.setData({
            orderId: wx.getStorageSync('orderId')
        })
        wx.request({
            url: "https://www.forhyj.cn/miniapp/User/setPayInfo",
            data: { orderId: this.orderId },
            method: "POST",
            success: function (res) {
                console.log(res);
                var dprice = res.data.ol_km_price;
                var etime = res.data.ol_end_time;
                var stime = res.data.ol_start_time;
                var tprice = res.data.ol_time_price;
                var total = dprice + tprice;
                var len = res.data.ol_km_num;
                var low = res.data.low;
                that.setData({
                    total: total,
                    dprice: dprice,
                    tprice: tprice,
                    stime: stime,
                    etime: etime,
                    len: len,
                    low: low
                })
            }
        })
    }
    

})