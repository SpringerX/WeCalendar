// pages/newSchedule/newSchedule.js
const app = getApp();
const utils = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scheduleTag: 'normal',
    content: '未知日程',
    isWholeDay: false,
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    remindTimeChoicesIndex: 0,
    repeatTimesChoicesIndex: 0,
    address: '',
    remark: '',
    remindTimeChoices: ['活动开始前', '不提醒', '5分钟前', '10分钟前', '15分钟前', '30分钟前', '1小时前', '1天前', '2天前', '1周前'],
    repeatTimesChoices: ['一次性活动', '每天', '周一至周五', '每周', '每月', '每年', '自定义'],
    groupId: '',
    publicCalendarId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.groupId){
      this.setData({
        groupId: options.groupId,
      });
    }
    if (options.publicCalendarId) {
      this.setData({
        publicCalendarId: options.publicCalendarId,
      });
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
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var strStartDate = utils.getStrDate(year, month, day, hour, minute);
    var strEndDate = utils.getStrDate(year, month, day, hour+1, minute);
    var strStartTime = utils.getStrTime(hour, minute);
    var strEndTime = utils.getStrTime(hour + 1, minute);
    console.log(now);
    this.setData({
      startDate: strStartDate,
      startTime: strStartTime,
      endDate: strEndDate,
      endTime: strEndTime,
    });
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

  click: function(e){
    this.setData({
      scheduleTag: e.currentTarget.id,
    });
  },

  contentChange: function(e){
    this.data.content = e.detail.value;     
  },

  switchChange: function(e){
    this.data.isWholeDay = e.detail.value;
  },

  startDateChange: function(e){
    this.setData({
      startDate: e.detail.value,
    });
  },


  startTimeChange: function(e){
    this.setData({
      startTime: e.detail.value,
    });
  },

  endDateChange: function(e){
    this.setData({
      endDate: e.detail.value,
    });
  },

  endTimeChange: function(e){
    this.setData({
      endTime: e.detail.value,
    });
  },

  remindTimeChange: function(e){
    this.setData({
      remindTimeChoicesIndex: e.detail.value,
    });
  },

  repeatTimesChange: function(e){
    this.setData({
      repeatTimesChoicesIndex: e.detail.value,
    });
  },

  updateAddress(e){
    this.data.address = e.detail.value;
  },

  updateRemark(e){
    this.data.remark = e.detail.value;
  },

  submit(e){
    let that = this;
    wx.request({
      url: app.globalData.myWebSiteUrl + 'newSchedule/',
      data: {
        'openid': app.globalData.openid,
        'schedule': that.data,
        'formId': e.detail.formId,
      },
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        try {
          wx.removeStorageSync('scheduleData-' + that.data.startDate);
        }catch (e) {
          console.log(e);
        }
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 1000,
          mask: true,
        });
      },
      fail: function(res) {
        wx.showToast({
          title: '请重试！',
          icon: 'loading',
          duration: 1000,
          mask: true,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        });
      },
      complete: function(res) {
        wx.navigateBack({
          delta: 1,
        });
      },
    });
  },
})