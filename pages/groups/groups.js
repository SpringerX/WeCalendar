// pages/groups/groups.js
const app = getApp();
var utils = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'groups',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    currentTab: 'often',
    isOften: true,
    groupInfo: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.hideTabBar();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    // 获取群组数据
    utils.getGroupInfo(this);
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
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
    // 获取群组数据
    utils.getGroupInfo(this);
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
  changeTab(e) {
    if(e.detail.key=='often'){
      this.setData({
        isOften: true,
        currentTab: 'often',
      });
    }else{
      this.setData({
        isOften: false,
        currentTab: 'else',
      });
    }
  },
  enterTheGroup(e) {
    console.log(e);
    var url = '../group/group?id=' + e.currentTarget.id + '&name=' + e.currentTarget.dataset.name;
    wx.navigateTo({
      url: url,
    });
  },
  joinGroup(e){
    wx.navigateTo({
      url: '../joinGroup/joinGroup'
    })
  },
})