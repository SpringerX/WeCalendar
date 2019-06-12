// pages/scheduleDetail/scheduleDetail.js
const app = getApp();
const utils = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scheduleTag: 'normal',
    content: '',
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
    scheduleId: '',
    userId: '',
    groupId: '',
    publicCalendarId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scheduleId) {
      this.setData({
        scheduleId: options.scheduleId,
      });
      try {
        var value = wx.getStorageSync('scheduleId-' + options.scheduleId);
        if (value) {
          // Do something with return value
          this.setData({
            scheduleTag: value['scheduleTag'],
            content: value['content'],
            isWholeDay: value['isWholeDay'],
            startDate: value['startDate'],
            startTime: value['startTime'],
            endDate: value['endDate'],
            endTime: value['endTime'],
            remindTimeChoicesIndex: 0,
            repeatTimesChoicesIndex: 0,
            address: value['address'],
            remark: value['remark'],
            scheduleId: value['id'],
            userId: value['user_id'],
            groupId: value['group_id'],
            publicCalendarId: value['publicCalendar_id'],
          })
        }
      } catch (e) {
        // Do something when catch error
        console.log(e);
      }
    } else {
      wx.showToast({
        title: '出错了！请返回',
        icon: 'loading',
        duration: 1000,
        mask: true,
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

  click: function (e) {
    this.setData({
      scheduleTag: e.currentTarget.id,
    });
  },

  contentChange: function (e) {
    this.data.content = e.detail.value;
  },

  switchChange: function (e) {
    this.data.isWholeDay = e.detail.value;
  },

  startDateChange: function (e) {
    this.setData({
      startDate: e.detail.value,
    });
  },


  startTimeChange: function (e) {
    this.setData({
      startTime: e.detail.value,
    });
  },

  endDateChange: function (e) {
    this.setData({
      endDate: e.detail.value,
    });
  },

  endTimeChange: function (e) {
    this.setData({
      endTime: e.detail.value,
    });
  },

  remindTimeChange: function (e) {
    this.setData({
      remindTimeChoicesIndex: e.detail.value,
    });
  },

  repeatTimesChange: function (e) {
    this.setData({
      repeatTimesChoicesIndex: e.detail.value,
    });
  },

  updateAddress(e) {
    this.data.address = e.detail.value;
  },

  updateRemark(e) {
    this.data.remark = e.detail.value;
  },

  submit(e) {
    let that = this;
    console.log(app.globalData.myWebSiteUrl);
    wx.request({
      url: app.globalData.myWebSiteUrl + 'updateSchedule/',
      data: {
        'openid': app.globalData.openid,
        'schedule': that.data,
        'formId': e.detail.formId,
      },
      header: {},
      method: 'PUT',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log(res.data);
        try {
          wx.removeStorageSync('scheduleData-' + that.data.startDate);
        } catch (e) {
          console.log(e);
        }
        wx.navigateBack({
          delta: 1,
        });
      },
      fail: function (res) {
        wx.showToast({
          title: '出错了！',
          icon: 'loading',
          duration: 1000,
          mask: true,
        });
      },
      complete: function (res) {
        console.log(res);
      },
    })
  },
  deleteSchedule: function(e){
    let that = this;
    wx.showModal({
      title: '删除不可恢复，确定继续？',
      content: '对于群组日历此操作将影响到所有群组成员，请谨慎操作！',
      success(res) {
        if (res.confirm) {
          // 先清除当天缓存
          try {
            wx.removeStorageSync('scheduleData-' + that.data.startDate);
          } catch (e) {
            console.log(e);
          }
          // 发送删除请求，参数为日程id
          utils.deleteSchedule(that.data.scheduleId);
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },
})