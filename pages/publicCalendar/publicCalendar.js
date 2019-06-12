// pages/newPublic/newPublic.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    publicCalendarId: '',
    submitFlag: false,
    name: '',
    introduction: '',
    count: 0,
    scheduleFlag: false,
    scheduleData: '',
    isPublisher: true,
    isSubscribed: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.publicCalendarId) {
      this.setData({
        publicCalendarId: options.publicCalendarId,
        submitFlag: true,
      });
      try {
        var value = wx.getStorageSync('publicCalendarId-' + options.publicCalendarId);
        if (value) {
          // Do something with return value
          var flag = false;
          if(app.globalData.openid == value['publisher_id']){
            flag = true;
          }
          this.setData({
            name: value['name'],
            introduction: value['introduction'],
            count: value['count'],
            isPublisher: flag,
            submitFlag: true,
            isSubscribed: value['isSubscribed'],
          });
        }
      } catch (e) {
        // Do something when catch error
        console.log(e);
      }

    }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  
  nameChange: function(e) {
    this.data.name = e.detail.value;
  },
  introductionChange: function (e) {
    this.data.introduction = e.detail.value;
  },
  submitPublic: function(e) {
    let that = this;
    wx.request({
      url: app.globalData.myWebSiteUrl + 'publicCalendar/',
      data: {
        'openid': app.globalData.openid,
        'schedule': that.data,
        'formId': e.detail.formId,
      },
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        that.setData({
          submitFlag: true,
          publicCalendarId: res.data[0].id,
          count: 0,
        });
        wx.showToast({
          title: '创建成功',
          icon: 'success',
          duration: 1500,
          mask: true,
        });
      },
      fail: function (res) {
        wx.showToast({
          title: '请检查网络',
          icon: 'loading',
          duration: 1500,
          mask: true,
        });
      },
    });
  },
  deletePublicCalendar: function(e) {
    let that = this;
    wx.request({
      url: app.globalData.myWebSiteUrl + 'publicCalendar/',
      data: {
        openid: app.globalData.openid,
        publicCalendarId: that.data.publicCalendarId, 
      },
      header: {},
      method: 'DELETE',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res);
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  editPublicCalendar: function(e) {
    this.setData({
      submitFlag: false,
    });
  },
  createNormalEvent: function(e) {
    let that = this;
    wx.navigateTo({
      url: '../newSchedule/newSchedule?publicCalendarId=' + that.data.publicCalendarId,
    });
  },
  subscribe: function(e) {
    let that = this;
    wx.request({
      url: app.globalData.myWebSiteUrl + 'subscribePublicCalendar/',
      data: {
        openid: app.globalData.openid,
        publicCalendarId: that.data.publicCalendarId,
        startDate: '',
        times: 1,
        intervalDays: 0,
      },
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        try {
          var value = wx.getStorageSync('publicCalendarId-' + that.data.publicCalendarId);
          if (value) {
            // Do something with return value
            that.setData({
              isSubscribed: true,
            });
            value['isSubscribed'] = true;
            wx.setStorageSync('publicCalendarId-' + that.data.publicCalendarId, value);
          }
        } catch (e) {
          // Do something when catch error
          console.log(e);
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  unsubscribe: function (e) {
    let that = this;
    wx.request({
      url: app.globalData.myWebSiteUrl + 'subscribePublicCalendar/',
      data: {
        openid: app.globalData.openid,
        publicCalendarId: that.data.publicCalendarId,
      },
      header: {},
      method: 'DELETE',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        try {
          var value = wx.getStorageSync('publicCalendarId-' + that.data.publicCalendarId);
          if (value) {
            // Do something with return value
            that.setData({
              isSubscribed: false,
            });
            value['isSubscribed'] = false;
            wx.setStorageSync('publicCalendarId-' + that.data.publicCalendarId, value);
          }
        } catch (e) {
          // Do something when catch error
          console.log(e);
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

})