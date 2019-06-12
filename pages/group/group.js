// pages/group/group.js
var utils = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: -1,
    name: '',
    scheduleData: [],
    scheduleFlag: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      name: options.name,
    });
    var title = '' + this.data.name + '(ID:' + this.data.id + ')';
    wx.setNavigationBarTitle({
      title: title,
    })
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
    utils.getGroupSchedule(this.data.id,this);
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

  newSchedule: function(){
    var url = '../newSchedule/newSchedule?groupId=' + this.data.id;
    wx.navigateTo({
      url: url,
    })
  },
  scheduleDetail(e) {
    wx.navigateTo({
      url: '../scheduleDetail/scheduleDetail?scheduleId=' + e.currentTarget.id,
    });
  },
})