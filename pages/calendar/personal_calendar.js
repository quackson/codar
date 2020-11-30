// pages/calendar/personal_calendar.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 此处为日历自定义配置字段
    calendarConfig: {
      defaultDay: true, // 默认选中指定某天；当为 boolean 值 true 时则默认选中当天，非真值则在初始化时不自动选中日期，
      highlightToday: true // 是否高亮显示当天，区别于选中样式（初始化时当天高亮并不代表已选中当天）
    },
    third_session: 1,
    assignments:[
      {
        assignmentID: 1,
        assignmentName:"期中考试",
        groupID: 1,
        prior: 0,
			  startTime:"?",
			  endTime:"?",
        category: 1,
        assignmentContent: "hey"
      },
      {
        assignmentID: 2,
        assignmentName:"期末考试",
        groupID: 3,
        prior: 1,
			  startTime:"?",
			  endTime:"?",
        category: 1,
        assignmentContent: "hey"
      },
      {
        assignmentID: 3,
        assignmentName:"期",
        groupID: 1,
        prior: 2,
			  startTime:"?",
			  endTime:"?",
        category: 1,
        assignmentContent: "hey"
      },
      {
        assignmentID: 4,
        assignmentName:"试",
        groupID: 3,
        prior: 3,
			  startTime:"?",
			  endTime:"?",
        category: 1,
        assignmentContent: "hey"
      }
    ],
    checkbox:{}
  },
  showModal(e) {
    console.log(e);
    this.setData({
      checkbox:this.data.tasks[e.currentTarget.dataset.id],
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
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
      case 'messages':
        wx.redirectTo({
          url: '../information/information' //?userid=
        })
        break;
      default:
        break;
    }
  },

  gotocreateactivity:function(){
    wx.navigateTo({
      url: '../create_activity/create_activity' // ?userid......
    })
  },

  formDate:function(year, month, day){
    let m = month / 10 < 1 ? '0' + month : '' + month;
    let d = day / 10 < 1 ? '0' + day : '' + day;
    return year + ':' + m + ':' + d
  },

  getGroupDailyAssignments:function(date){
    let self = this;

    wx.request({
      url: app.globalData.server + 'user/assign',
      data: {
          userID: self.data.third_session,
          date: date
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      
      success:function(res){
        console.log('request getGroupDailyAssignments returns: ', res.data)
          
        if (res.data.retCode == 200){
          let list = self.data.assignments;
          if (typeof res.data.assignments !== "undefined"){
            list = res.data.assignments
          }
          
          self.setData({
              assignments: list
          })
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

  getGroupDailyTasks:function(date){
    let self = this;

    wx.request({
      url: app.globalData.server + 'user/task',
      data: {
          userID: self.data.third_session,
          date: date
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      
      success:function(res){
        console.log('request getGroupDailyAssignments returns: ', res.data)
          
        if (res.data.retCode == 200){
          let list = self.data.tasks;
          if (typeof res.data.tasks !== "undefined"){
            list = res.data.tasks
          }
          
          self.setData({
              tasks: list
          })
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

  afterTapDay:function(e){
    console.log(e.detail.year)
    console.log(e.detail.month)
    console.log(e.detail.date)
    this.getGroupDailyTasks(this.formDate(e.detail.year, e.detail.month, e.detail.date))
  },

  afterCalendarRender:function(e){
    console.log(e.detail.__data__.calendar.selectedDay[0].year)
    console.log(e.detail.__data__.calendar.selectedDay[0].month)
    console.log(e.detail.__data__.calendar.selectedDay[0].day)
    this.getGroupDailyTasks(this.formDate(e.detail.__data__.calendar.selectedDay[0].year, e.detail.__data__.calendar.selectedDay[0].month, e.detail.__data__.calendar.selectedDay[0].day))
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      NavCur: app.globalData.NavCur
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