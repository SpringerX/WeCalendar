const app = getApp()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const daysOfMonth = [
  [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
]
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function isLeapYear(year) {
  if ((year % 400 == 0) || (year % 4 == 0 && year % 100 != 0)) {
    return 1;
  }
  else {
    return 0;
  }
}

function getStrDate(year, month, day, hour, minute) {
  if(hour>23 || (hour==23 && minute>30))
  {
    return getNextDayStr(year, month, day);
  }
  var strDate = '' + year;
  if (month < 9) {
    strDate += '-0' + month;
  } else {
    strDate += '-' + month;
  }
  if (day < 9) {
    strDate += '-0' + day;
  } else {
    strDate += '-' + day;
  }
  return strDate;
}

function getStrTime(hour, minute) {
  var strTime = '';
  if (minute > 30) {
    hour += 1;
  }
  hour = hour % 24;
  if (hour < 9) {
    strTime += '0' + hour;
  } else {
    strTime += '' + hour;
  }
  if (minute < 30) {
    strTime += ':30';
  } else {
    strTime += ':00';
  }
  return strTime;
}

function getNextDayStr(year, month, day){
  var flag = 0;
  if(isLeapYear(year)){
    flag = 1;
  }
  if(day<daysOfMonth[flag][month]){
    day++;
  }else if(month<12){
    month++;
    day=1;
  }else{
    year++;
    month=1;
    day=1;
  }
  return getStrDate(year, month, day, 0, 0);
}

function findTheFirstDay(year, month) {
  if(month == 13){
    year += 1;
    month = 1;
  }
  var count = 0;
  for (var i = 1901; i < year; i++) {
    if (isLeapYear(i) == true) {
      count += 366;
    } else {
      count += 365;
    }
  }
  var temp = 0;
  if (isLeapYear(year) == true) {
    temp = 1;
  }
  for (i = 0; i < month - 1; i++) {
    count += daysOfMonth[temp][i];
  }
  count += 2;
  var result = count % 7;
  return result;
}

function getTheMonth(year, month){
  var week = findTheFirstDay(year, month);
  var flag = isLeapYear(year);
  var days = [];
  var daysOfLastMonth = daysOfMonth[flag][(month+12-2)%12];
  var i = daysOfLastMonth - week + 1;
  for(; i <= daysOfLastMonth; i++){
    days.push(i);
  }
  var daysOfThisMonth = daysOfMonth[flag][(month-1)%12];
  for(i = 1; i <= daysOfThisMonth; i++){
    days.push(i);
  }
  var nextWeek = findTheFirstDay(year, month+1);
  if(nextWeek != 0){
    for(var j = nextWeek; j < 7; j++)
    {
      days.push(j - nextWeek + 1);
    }
  }
  return days;
}

/**
 * 获取flags数组，标识days数组中是否为当月信息
 */
function getFlags(days){
  var temp = false;
  var flags = [];
  for(var i = 0; i < days.length; i++){
    if(days[i] == 1){
      temp = !temp;
    }
    if(temp){
      flags.push(true);
    }else{
      flags.push(false);
    }
  }
  return flags;
}

function getDayLunar(year, month, last, count, self){
  var temp = '';
  var strYear = temp + year;
  var strLast = temp + last;
  var strCount = temp + count;
  if (month < 9)
    temp += '0';
  var strMonth = temp + month;
  try {
    var value = wx.getStorageSync('lunar-' + strYear + '-' + strMonth);
    if (value) {
      // Do something with return value
      self.setData({
        dayLunar: value,
        flagLunar: true,
      });
    }else{
      wx.request({
        url: app.globalData.myWebSiteUrl + 'get-lunar/',
        data: {
          year: strYear,
          month: strMonth,
          last: strLast,
          count: strCount,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          self.setData({
            dayLunar: res.data,
            flagLunar: true,
          });
          try {
            wx.setStorageSync('lunar-' + strYear + '-' + strMonth, res.data);
          } catch (e) {
            console.log(e);
          }
        },
        fail(res) {
          self.setData({
            dayLunar: [],
            flagLunar: false,
          })
        }
      });
    }
  } catch (e) {
    // Do something when catch error
    console.log(e);
  }
  
}

function todayAnimation(before, after, that){
  if (before == true && after == false) {
    const animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    });
    animation.opacity(1).translate(0, 0).step();
    that.setData({
      todayAnimationData: animation.export(),
      isToday:false,
    });
  } else if (before == false && after == true) {
    const animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    });
    animation.opacity(0).translate(-10, -20).step();
    that.setData({
      todayAnimationData: animation.export(),
      isToday:true,
    });
  }
}

function loginWeCalendar(code, phoneNumber, userInfo){
  wx.request({
    url: app.globalData.myWebSiteUrl + 'login/',
    data: {
      code: code,
      phoneNumber: phoneNumber,
      userInfo: userInfo,
    },
    header: {},
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function(res) {
      app.globalData.openid = res.data.openid;
      wx.setStorage({
        key: 'openid',
        data: res.data.openid
      })
    },
    fail: function(res) {
      wx.showToast({
        title: '请重试',
        icon: 'loading'
      });
    },
    complete: function(res) {
    },
  });
}

function getScheduleStorage(year, month, day, that) {
  try{
    var value = wx.getStorageSync('scheduleData-' + getStrDate(year, month, day));
    if (that.data.selectedYear == year && that.data.selectedMonth == month && that.data.selectedDay == day) {
      if (value) {
        // Do something with return value
        that.setData({
          scheduleData: value,
          scheduleFlag: true,
        });
      } else {
        that.setData({
          scheduleData: [],
          scheduleFlag: false,
        });
      }
    }
  } catch (e) {
    // Do something when catch error
    console.log(e);
  }
}
function getSchedule(year, month, day, that){
  try {
    getScheduleStorage(year, month, day, that);
    wx.request({
      url: app.globalData.myWebSiteUrl + 'getSchedule/',
      data: {
        year: year,
        month: month,
        day: day,
        openid: app.globalData.openid,
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        var scheduleFlag = true;
        if (res.statusCode == '200') {
          if (res.data.length == 0) {
            that.setData({
              scheduleFlag: false,
            });
          } else {
            for (var i = 0; i < res.data.length; i++) {
              var date1 = res.data[i]['startDateTime'].substr(0, 10);
              var date2 = res.data[i]['endDateTime'].substr(0, 10);
              res.data[i]['startTime'] = res.data[i]['startDateTime'].substr(11, 5);
              res.data[i]['endTime'] = res.data[i]['endDateTime'].substr(11, 5);
              res.data[i]['startDate'] = date1;
              res.data[i]['endDate'] = date2;
              if (date1 != date2) {
                res.data[i]['endTime'] = '23:59';
              }
              try {
                wx.setStorageSync('scheduleId-' + res.data[i]['id'], res.data[i]);
              } catch (e) {
                console.log(e);
              }
            }
          }
          that.setData({
            scheduleData: res.data,
            scheduleFlag: scheduleFlag,
          });
        }
        try {
          wx.setStorageSync('scheduleData-' + getStrDate(year, month, day), res.data);
        } catch (e) {
          console.log(e);
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    });
  } catch (e) {
    // Do something when catch error
    console.log(e);
  }
  
}
function getGroupInfo(that) {
  // 获取群组数据
  wx.request({
    url: app.globalData.myWebSiteUrl + 'getGroupInfo/',
    data: {
      openid: app.globalData.openid,
    },
    header: {},
    method: 'GET',
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      if (res.statusCode != '200') {
        that.setData({
          groupInfo: [],
        });
      } else {
        that.setData({
          groupInfo: res.data,
        });
      }
    },
    fail: function (res) {
      that.setData({
        groupInfo: [],
      });
    },
  });
}

function getPublicCalendar(that) {
  wx.request({
    url: app.globalData.myWebSiteUrl + 'publicCalendar/',
    data: {
      openid: app.globalData.openid,
      key: that.data.key,
    },
    header: {},
    method: 'GET',
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      if (res.statusCode == '200') {
        if (res.data.length == 0) {
          that.setData({
            publicCalendarData: [],
          });
        } else {
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].isSubscribed = false;
            if (that.data.subscribedId){
              for (var j = 0; j < that.data.subscribedId.length; j++) {
                if (that.data.subscribedId[j] == res.data[i]['id']) {
                  res.data[i].isSubscribed = true;
                  break;
                }
              }
            }
            try {
              wx.setStorageSync('publicCalendarId-' + res.data[i]['id'], res.data[i]);
            } catch (e) {
              console.log(e);
            }
          }
          that.setData({
            publicCalendarData: res.data,
          });
        }
      }
    },
    fail: function (res) {
      that.setData({
        publicCalendarData: [],
      });
      console.log(res);
    },
  });
}
function getSubscribePC(that) {
  wx.request({
    url: app.globalData.myWebSiteUrl + 'subscribedPC/',
    data: {
      openid: app.globalData.openid,
    },
    header: {},
    method: 'GET',
    dataType: 'json',
    responseType: 'text',
    success: function(res) {
      if (res.statusCode == '200') {
        if (res.data.length == 0) {
          that.setData({
            subscribedPCId: [],
            subscribedId: [],
          });
        } else {
          var result = [];
          for (var i = 0; i < res.data.length; i++) {
            result[i] = res.data[i].publicCalendar_id;
          }
          that.setData({
            subscribedId: result,
          });
          console.log(result);
        }
        getPublicCalendar(that);
      }
    },
    fail: function(res) {
      that.setData({
        subscribedId: [],
      });
    },
    complete: function(res) {},
  })
}
function getGroupSchedule(group_id, that) {
  wx.request({
    url: app.globalData.myWebSiteUrl + 'getGroupSchedule/',
    data: {
      group_id: group_id,
      openid: app.globalData.openid,
    },
    header: {},
    method: 'GET',
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      var scheduleFlag = true;
      if(res.statusCode != '200'){
        that.setData({
          scheduleData: [],
          scheduleFlag: false,
        });
      }else {
        if (res.data.length == 0) {
          scheduleFlag = false;
        } else {
          for (var i = 0; i < res.data.length; i++) {
            var date1 = res.data[i]['startDateTime'].substr(0, 10);
            var date2 = res.data[i]['endDateTime'].substr(0, 10);
            res.data[i]['startTime'] = res.data[i]['startDateTime'].substr(11, 5);
            res.data[i]['endTime'] = res.data[i]['endDateTime'].substr(11, 5);
            res.data[i]['startDate'] = date1;
            res.data[i]['endDate'] = date2;
            try {
              wx.setStorageSync('scheduleId-' + res.data[i]['id'], res.data[i]);
            } catch (e) {
              console.log(e);
            }
          }
        }
        that.setData({
          scheduleData: res.data,
          scheduleFlag: scheduleFlag,
        });
      }
    },
    fail: function (res) {
      that.setData({
        scheduleData: [],
        scheduleFlag: false,
      });
    },
    complete: function (res) { },
  });
  
}
function deleteSchedule(scheduleId) {
  wx.request({
    url: app.globalData.myWebSiteUrl + 'deleteSchedule/',
    data: {
      scheduleId: scheduleId,
      openid: app.globalData.openid,
    },
    header: {},
    method: 'DELETE',
    dataType: 'json',
    responseType: 'text',
    success: function(res) {},
    fail: function(res) {
      console.log(res);
    },
    complete: function(res) {
      wx.navigateBack({
        delta: 1,
      });
    },
  })
}
module.exports = {
  formatTime: formatTime,
  findTheFirstDay: findTheFirstDay,
  getTheMonth: getTheMonth,
  getFlags: getFlags,
  getDayLunar: getDayLunar,
  getStrDate: getStrDate,
  getStrTime: getStrTime,
  todayAnimation: todayAnimation,
  loginWeCalendar: loginWeCalendar,
  getSchedule: getSchedule,
  getGroupInfo: getGroupInfo,
  getPublicCalendar: getPublicCalendar,
  getSubscribePC: getSubscribePC,
  getGroupSchedule: getGroupSchedule,
  deleteSchedule: deleteSchedule,
}
