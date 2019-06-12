// pages/homepage/homepage.js
var utils = require('../../utils/util');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weekShort: ['日', '一', '二', '三', '四', '五', '六'],
    chooseFlag: -1,
    date: '',
    days: [],
    flags: [],
    dayLunar: [],
    flagLunar: false,
    current: 'homepage',
    selectedDay: 0,
    selectedYear: 0,
    selectedMonth: 0,
    today: [],
    animationData: {},
    todayAnimationData: {},

    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    currentSwiper: 1,
    idOfDays: 0,
    lunarString: [],
    scheduleData: [],
    scheduleFlag: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideTabBar();
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth()+1;
    var day = now.getDate();
    var days = utils.getTheMonth(year, month);
    var flags = utils.getFlags(days);

    var idOfDays = 0;
    for (var i = 0; i < days.length; i++) {
      if (flags[i] == true && days[i] == day) {
        idOfDays = i;
        break;
      }
    }

    var strDate = utils.getStrDate(year, month, day);
    this.setData({
      selectedYear: year,
      selectedMonth: month,
      selectedDay: day,
      days: days,
      flags: flags,
      date: strDate,
      today: [year, month, day],
      isToday: true,
      idOfDays: idOfDays,
    });

    var last = utils.findTheFirstDay(year, month);
    utils.getDayLunar(year, month, last, days.length, this);
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
    const animation0 = wx.createAnimation({
      duration: 0,
      timingFunction: 'ease',
    });

    var flag = this.data.chooseFlag;
    animation0.translateY(60 * flag).step()

    this.setData({
      animationData: animation0.export(),
    });

    var year = this.data.selectedYear;
    var month = this.data.selectedMonth;
    var day = this.data.selectedDay;
    var isToday = false;
    if (year == this.data.today[0] && month == this.data.today[1] && day == this.data.today[2]) {
      this.data.isToday = false;
      isToday = true;
    }
    utils.todayAnimation(this.data.isToday, isToday, this);

    var year = this.data.selectedYear;
    var month = this.data.selectedMonth;
    var day = this.data.selectedDay;
    utils.getSchedule(year, month, day, this);
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
    try {
      wx.clearStorageSync();
      wx.setStorageSync('openid', app.globalData.openid)

    } catch (e) {
      // Do something when catch error
    }
    
    var year = this.data.selectedYear;
    var month = this.data.selectedMonth;
    var day = this.data.selectedDay;
    var days = utils.getTheMonth(year, month);
    var flags = utils.getFlags(days);

    var idOfDays = 0;
    for (var i = 0; i < days.length; i++) {
      if (flags[i] == true && days[i] == day) {
        idOfDays = i;
        break;
      }
    }

    var strDate = utils.getStrDate(year, month, day);
    this.setData({
      days: days,
      flags: flags,
      date: strDate,
      today: [year, month, day],
      isToday: true,
      idOfDays: idOfDays,
    });
    var last = utils.findTheFirstDay(year, month);
    utils.getDayLunar(year, month, last, days.length, this);
    utils.getSchedule(year, month, day, this);
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

  selectDay: function(e){
    var ifReloadLunar = false;
    var year = this.data.selectedYear;
    var month = this.data.selectedMonth;
    var day = this.data.days[e.currentTarget.id];
    if (this.data.flags[e.currentTarget.id] == true){
      this.setData({ selectedDay: day, idOfDays: e.currentTarget.id, })
    } else if (e.currentTarget.id < 6){
      if(month == 1){
        year--;
        month = 12;
      }else{
        month--;
      }
    }else{
      if (month == 12) {
        year++;
        month = 1;
      } else {
        month++;
      }
    }
    var days = utils.getTheMonth(year, month);
    var flags = utils.getFlags(days);

    var idOfDays = 0;
    for (var i = 0; i < days.length; i++) {
      if (flags[i] == true && days[i] == day) {
        idOfDays = i;
        break;
      }
    }

    var strDate = utils.getStrDate(year, month, day);
    if(month != this.data.selectedMonth)
    {
      ifReloadLunar = true;
    }
    var isToday = false;
    if(year==this.data.today[0]&&month==this.data.today[1]&&day==this.data.today[2]){
      isToday = true;
    }
    utils.todayAnimation(this.data.isToday, isToday, this);
    this.setData({
      selectedYear: year,
      selectedMonth: month,
      selectedDay: day,
      days: days,
      flags: flags,
      date: strDate,
      isToday: isToday,
      idOfDays: idOfDays,
    });
    var last = utils.findTheFirstDay(year, month);
    if (ifReloadLunar) {
      utils.getDayLunar(year, month, last, days.length, this);
    }

    utils.getSchedule(year, month, day, this);
  },

  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var ifReloadLunar = false;
    var selectedDate = new Date(e.detail.value);
    var year = selectedDate.getFullYear();
    var month = selectedDate.getMonth() + 1;
    var day = selectedDate.getDate();
    var days = utils.getTheMonth(year, month);
    var flags = utils.getFlags(days);

    var idOfDays = 0;
    for (var i = 0; i < days.length; i++) {
      if (flags[i] == true && days[i] == day) {
        idOfDays = i;
        break;
      }
    }

    if (month != this.data.selectedMonth) {
      ifReloadLunar = true;
    }
    var isToday = false;
    if (year == this.data.today[0] && month == this.data.today[1] && day == this.data.today[2]) {
      isToday = true;
    }
    utils.todayAnimation(this.data.isToday, isToday, this);
    this.setData({
      selectedYear: year,
      selectedMonth: month,
      selectedDay: day,
      days: days,
      flags: flags,
      isToday: isToday,
      idOfDays: idOfDays,
    });

    var last = utils.findTheFirstDay(year, month);
    if (ifReloadLunar) {
      utils.getDayLunar(year, month, last, days.length, this);
    }
    utils.getSchedule(year, month, day, this);
  },

  changeView(e) {
    var flag = this.data.chooseFlag;
    const animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    });
    if(flag==-1){
      flag = 0;
    }else{
      flag = -1;
    }
    animation.translateY(60*flag).step();
    this.setData({
      animationData: animation.export(),
      chooseFlag: flag,
    });

  
  },

  /**
   * TabBar点击事件
   */
  handleChange(e) {
    var switchStr = e.detail.key;
    wx.switchTab({
      url: '../' + switchStr + '/' + switchStr,
    });
  },

  /**
   * 用户点击右下角“今”按钮事件
   */
  findToday(e) {
    const animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    });
    animation.opacity(0).translate(-10,-20).step();
    this.setData({
      todayAnimationData: animation.export(),
    });

    var ifReloadLunar = false;
    var year = this.data.today[0];
    var month = this.data.today[1];
    var day = this.data.today[2];
    var days = utils.getTheMonth(year, month);
    var flags = utils.getFlags(days);

    var idOfDays = 0;
    for (var i = 0; i < days.length; i++) {
      if (flags[i] == true && days[i] == day) {
        idOfDays = i;
        break;
      }
    }

    if (month != this.data.selectedMonth) {
      ifReloadLunar = true;
    }
    var strDate = utils.getStrDate(year, month, day);
    this.setData({
      selectedYear: year,
      selectedMonth: month,
      selectedDay: day,
      days: days,
      flags: flags,
      date: strDate,
      isToday: true,
      idOfDays: idOfDays,
    });
    var last = utils.findTheFirstDay(year, month);
    if (ifReloadLunar) {
      utils.getDayLunar(year, month, last, days.length, this);
    }
    utils.getSchedule(year, month, day, this);
  },

  /**
   * 左右滑动切换月份事件
   */
  swiperAnimationFinish(e){
    var year = this.data.selectedYear;
    var month = this.data.selectedMonth;
    if(e.detail.current==2){
      if(month<12){
        month += 1;
      }else{
        year += 1;
        month = 1;
      }
    }else if(e.detail.current==0){
      if (month > 1) {
        month -= 1;
      } else {
        year -= 1;
        month = 12;
      }
    }
    var ifReloadLunar = false;
    
    
    var day = this.data.selectedDay;
    var days = utils.getTheMonth(year, month);
    var flags = utils.getFlags(days);

    var idOfDays = 0;
    for (var i = 0; i < days.length; i++) {
      if (flags[i] == true && days[i] == day) {
        idOfDays = i;
        break;
      }
    }

    if (month != this.data.selectedMonth) {
      ifReloadLunar = true;
    }
    var isToday = false;
    if (year == this.data.today[0] && month == this.data.today[1] && day == this.data.today[2]) {
      isToday = true;
    }
    utils.todayAnimation(this.data.isToday, isToday, this);
    var strDate = utils.getStrDate(year, month, day);
    this.setData({
      selectedYear: year,
      selectedMonth: month,
      selectedDay: day,
      days: days,
      flags: flags,
      date: strDate,
      isToday: isToday,
      duration: 0,
      idOfDays: idOfDays,
    });
    this.setData({
      duration: 1000,
      currentSwiper: 1,
    });
    var last = utils.findTheFirstDay(year, month);
    if (ifReloadLunar) {
      utils.getDayLunar(year, month, last, days.length, this);
    }
    utils.getSchedule(year, month, day, this);
  
  },
  newSchedule(e){
    wx.navigateTo({
      url: '../newSchedule/newSchedule',
    })
  },
  chooseView(e){
    console.log(e.currentTarget.id);
  },
  scheduleDetail(e){
    wx.navigateTo({
      url: '../scheduleDetail/scheduleDetail?scheduleId=' + e.currentTarget.id,
    });
  },
})