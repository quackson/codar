// pages/discussion/discussion.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:-1,
    groupID:-1,
    groupName:'',
    pendingTasks:[
      /*
      {
        userID:0,
        userName:'User1',
        pendingTaskID:0,
        pendingTaskName:'proposal1',
        startTime:'2020:08:01:00:00',
        endTime:'2020:12:20:12:00',
        pendingTaskContent:'完成前端的编写',
        voteNum:3,
        myvote:0
      },
      {
        userID:1,
        userName:'User2',
        pendingTaskID:1,
        pendingTaskName:'proposal2',
        startTime:'2020:08:01:00:00',
        endTime:'2020:12:20:12:00',
        pendingTaskContent:'完成后端的编写',
        voteNum:2,
        myvote:1
      },
      {
        userID:2,
        userName:'User3',
        pendingTaskID:2,
        pendingTaskName:'proposal3',
        startTime:'2020:08:01:00:00',
        endTime:'2020:12:20:12:00',
        pendingTaskContent:'完成前后端交互部分',
        voteNum:5,
        myvote:2
      }
      */
    ],

  },
  voteYes(e){

  },
  voteNo(e){

  },
  NavChange:function(e){
    app.globalData.NavCur = e.currentTarget.dataset.cur
    
    switch (app.globalData.NavCur) {
      case 'index':
        wx.redirectTo({
          url: '../index/index'
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
      case 'groupList':
        wx.redirectTo({
          url: '../group_list/group_list' //?userid=
        })
        break;
      default:
        break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      NavCur: app.globalData.NavCur,
      groupID:options.groupid,
      groupName:options.groupname      
    })
    let app_=app
    let this_=this
    wx.request({
      url: app.globalData.server+'/user/info',
      data:{      
        userID:app.globalData.userID
      },
      method:"GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){
        this_.setData({
          userName:res.data.userName
        })
      }
    })
    console.log('userid: '+options.userid)
    console.log('groupid: '+options.groupid)
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