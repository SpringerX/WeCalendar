// pages/newGroup/newGroup.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarBaseUrl: 'https://weapp.springzzz.tech/static/tutorial/images/groups/',
    groupId: -1,
    avatarFlag: false,
    name: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.setData({
        groupId: options.id,
        name: options.name,
        avatarFlag: true,
      });
      var title = '' + this.data.name + '(ID:' + this.data.groupId + ')';
      wx.setNavigationBarTitle({
        title: title,
      })
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

  onUnload: function() {
    let that = this;
    if (this.data.groupId != -1){     //说明已经上传头像并分配了群号
      if (this.data.name == '') {
        wx.request({
          url: app.globalData.myWebSiteUrl + 'group/',
          data: {
            groupId: that.data.groupId,
            openid: app.globalData.openid,
          },
          method: 'DELETE',
          dataType: 'json',
          responseType: 'text',
          success: function (res) {
            console.log(res);
          },
        })
      } else {
        console.log("建议提交群名");
      }
    }
  },
  
  chooseAvatar: function(){
    let that = this;
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        const uploadTask = wx.uploadFile({
          url: app.globalData.myWebSiteUrl + 'uploadGroupAvatar/', 
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            adminId: app.globalData.openid,
            groupId: that.data.groupId,
          },
          success(res) {  
            var resData = JSON.parse(res.data);
            if (resData.id){
              that.setData({
                avatarFlag: true,
                groupId: resData.id,
              });
            }
            //do something
          }
        });
        // uploadTask.onProgressUpdate((res) => {
        //   console.log('上传进度', res.progress)
        //   console.log('已经上传的数据长度', res.totalBytesSent)
        //   console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
        // });
      }
    })
  },

  nameChange: function (e) {
    this.data.name = e.detail.value;
  },

  submitGroup: function(e) {
    let that = this;
    if(this.data.groupId == -1){
      wx.request({
        url: app.globalData.myWebSiteUrl + 'group/',
        data: {
          name: that.data.name,
          openid: app.globalData.openid,
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          that.data.groupId = res.data.id;
          console.log(that.data.groupId);
          that.data.name = res.data.name;
        },
      });
    } else {
      wx.request({
        url: app.globalData.myWebSiteUrl + 'group/',
        data: {
          groupId: that.data.groupId,
          name: that.data.name,
          openid: app.globalData.openid,
        },
        method: 'PUT',
        dataType: 'json',
        responseType: 'text',
        success: function (res) { 
          console.log(res);
        },
      });
    }
  },
  deleteTheGroup: function(e){
    let that = this;
    wx.request({
      url: app.globalData.myWebSiteUrl + 'group/',
      data: {
        groupId: that.data.groupId,
        openid: app.globalData.openid,
      },
      header: {},
      method: 'DELETE',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res);
      },
    })
  },
})