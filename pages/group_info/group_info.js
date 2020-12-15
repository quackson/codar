// pages/group_info/group_info.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupName: "某团队",
    isAdmin: false,
    members: []
  },
  NavChange:function(e){
    app.globalData.NavCur = e.currentTarget.dataset.cur
    
    switch (app.globalData.NavCur) {
      case 'index':
        wx.redirectTo({
          url: '../index/index'
        })
        break;
      case 'groupList':
        wx.redirectTo({
          url: '../group_list/group_list' //?userid=
        })
        break;
      case 'createGroup':
        wx.redirectTo({
          url: '../create_group/create_group' //TODO
        })
        break;
      case 'personalCalendar':
        wx.redirectTo({
          url: '../calendar/personal_calendar' //?userid=
        })
        break;
      case 'messages':
        wx.redirectTo({
          url: '../information/information' //?userid=
        })
        break;
      default:
        break;
    }
  },

  getMembers:function(){
    let self = this;
    wx.request({
      url: app.globalData.server + 'group/user',
      data: {
          groupID: self.data.groupID
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      
      success:function(res){
        console.log('request getMembers returns: ', res.data)
          
        if (res.data.retCode == 200){
          if (typeof res.data.users !== "undefined"){
            self.setData({
              members: res.data.users
            })
          }
        }
        else{
          console.log('获取失败！' + res.errMsg)
        }
      },
      fail: function(res) {
          console.log('获取失败！' + res.errMsg)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      NavCur: app.globalData.NavCur,
      isAdmin: options.isadmin === 'true',
      third_session: options.userid,
      groupID: options.groupid,
      groupName: options.groupname
    })
    this.getMembers();
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

  }
})