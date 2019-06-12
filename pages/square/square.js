// pages/square/square.js
const app = getApp();
const utils = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,
    current: 'square',
    key: '',
    publicCalendarData: '',
    subscription: ['订阅','取消'],
    subscribedPCId: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideTabBar();
    utils.getSubscribePC(this);
  },

  onPageScroll: function (e) {
    this.data.scrollTop = e.scrollTop;
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

  handleChange(e) {
    var switchStr = e.detail.key;
    wx.switchTab({
      url: '../' + switchStr + '/' + switchStr,
    });
  },

  handleSubscribe(e) {
    // console.log(this.data.publicCalendarData[e.currentTarget.id]);
    if(this.data.publicCalendarData[e.currentTarget.id].isSubscribed){
      let that = this;
      wx.request({
        url: app.globalData.myWebSiteUrl + 'subscribePublicCalendar/',
        data: {
          openid: app.globalData.openid,
          publicCalendarId: that.data.publicCalendarData[e.currentTarget.id].id,
        },
        header: {},
        method: 'DELETE',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          that.data.publicCalendarData[e.currentTarget.id].isSubscribed = false;
          that.setData({
            publicCalendarData: that.data.publicCalendarData,
          });
          var publicCalendarId = that.data.publicCalendarData[e.currentTarget.id].id;
          try {
            var value = wx.getStorageSync('publicCalendarId-' + publicCalendarId);
            if (value) {
              // Do something with return value
              value['isSubscribed'] = false;
              wx.setStorageSync('publicCalendarId-' + publicCalendarId, value);
            }
          } catch (e) {
            // Do something when catch error
            console.log(e);
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      });
    } else {
      let that = this;
      wx.request({
        url: app.globalData.myWebSiteUrl + 'subscribePublicCalendar/',
        data: {
          openid: app.globalData.openid,
          publicCalendarId: that.data.publicCalendarData[e.currentTarget.id].id,
          startDate: '',
          times: 1,
          intervalDays: 0,
        },
        header: {},
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          that.data.publicCalendarData[e.currentTarget.id].isSubscribed = true;
          that.setData({
            publicCalendarData: that.data.publicCalendarData,
          });
          var publicCalendarId = that.data.publicCalendarData[e.currentTarget.id].id;
          try {
            var value = wx.getStorageSync('publicCalendarId-' + publicCalendarId);
            if (value) {
              // Do something with return value
              value['isSubscribed'] = true;
              wx.setStorageSync('publicCalendarId-' + publicCalendarId, value);
            }
          } catch (e) {
            // Do something when catch error
            console.log(e);
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      });
    }
  },

  joinPublic(e) {
    try {
      const res = wx.getStorageInfoSync()
      console.log(res.keys)
      console.log(res.currentSize)
      console.log(res.limitSize)
    } catch (e) {
      // Do something when catch error
    }
    wx.navigateTo({
      url: '../publicCalendar/publicCalendar',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    });
  },
  nameChange(e) {
    this.data.key = e.detail.value;
  },
  findPublicCalendars(e) {
    this.setData({
      publicCalendarData: [],
    });
    utils.getSubscribePC(this);
  },
  publicCalendarDetail(e) {
    wx.navigateTo({
      url: '../publicCalendar/publicCalendar?publicCalendarId=' + e.currentTarget.id,
    });
  },
})