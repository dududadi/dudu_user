Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  
  payment:function()
  {
    //获取当前登录的openid
    var openid = wx.getStorageSync('openid')
    //console.log(openid);
    //获取当前时间戳
    //var timestamp = Date.parse(new Date());
   // timestamp = timestamp / 1000;
    //console.log("当前时间戳为：" + timestamp);
    wx.request({
      url: 'https://www.forhyj.cn/miniapp/WexinPay/Pay',
      method: 'GET',
      data: {
        openid:openid,
        total_fee:1
      },
      success: function (res) {
        console.log(res);
      },
      fail:function(res){
        console.res; 
      }
    })
  },
   
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    
  }
})