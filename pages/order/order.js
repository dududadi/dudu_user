Page({
  data: {
    toView: 'red',
    scrollTop: 0,
    commentShow: 'none',
    commentTime: '',
    commentScore: '',
    commentText: ''
  },
  tap: function (e) {
    for (var i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1]
        })
        break
      }
    }
  },
  goComment: function (event) {
      var driverId = event.target.dataset.driverid;
      var orderId = event.target.id;
      console.log(event);
      console.log(orderId);
      wx.redirectTo({
          url: '../comment/comment?orderId=' + orderId + '&driverId=' + driverId
      })
  },
  goPay: function (event) {
      var driverId = event.target.dataset.driverid;
      var orderId = event.target.id;
      console.log(event);
      console.log(orderId);
      wx.redirectTo({
          url: '../pay/pay?orderId=' + orderId + '&driverId=' + driverId
      })
  },
  tapMove: function (e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },
  //查看评分信息
  checkComment: function (e) {
    var that = this;
    var orderId = e.target.id;
    var that = this;
    wx.request({
      url: 'https://www.forhyj.cn/miniapp/user/getOrderComment',
      method: 'POST',
      data: {orderId: orderId},
      success: function (res) {
        console.log(res.data);
        that.setData({
          commentTime: res.data.cutd_time,
          commentScore: res.data.cutd_score,
          commentText: res.data.cutd_content,
          commentShow: 'block'
        });
      }
    });
  },
  //关闭评分信息
  closeComment: function (e) {
    this.setData({
      commentShow: 'none'
    });
  },
  onLoad:function (location) {
    //var wxopid=location.openid;
    var wxopid = wx.getStorageSync('openid');
    var that=this;
    wx.request({
      url: 'https://www.forhyj.cn/miniapp/order/userOrderList',
      method:'POST',
      data: { 'wxopid': wxopid},
      success:function(res){
        that.setData({
          resArr: res.data
        })
      }
    })
  }
})