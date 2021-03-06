// pages/joinGroup/joinGroup.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: '',
    groupInfo: [],
    isClicked: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: app.globalData.myWebSiteUrl + 'searchGroups/',
      data: {
        key: that.data.key,
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log(res);
        that.setData({
          groupInfo: res.data,
          isClicked: true,
        });
      },
      fail: function (res) { },
      complete: function (res) { },
    });
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

  changeKey: function(e) {
    this.setData({
      key: e.detail.value,
    });
  },

  searchGroups: function (e) {
    let that = this;
    wx.request({
      url: app.globalData.myWebSiteUrl + 'searchGroups/',
      data: {
        key: that.data.key,
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res);
        that.setData({
          groupInfo: res.data,
          isClicked: true,
        });
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  newGroupButton: function(e) {
    wx.navigateTo({
      url: '../newGroup/newGroup',
    });
  },

  enterTheGroup: function(e) {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定要加入该群组吗？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: 'black',
      confirmText: '确定',
      confirmColor: 'green',
      success: function(res) {
        if(res.confirm){
          wx.request({
            url: app.globalData.myWebSiteUrl + 'groupRelationship/',
            data: {
              groupId: e.currentTarget.id,
              openid: app.globalData.openid,
            },
            header: {},
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: function(res) {
              console.log(res);
            },
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
})