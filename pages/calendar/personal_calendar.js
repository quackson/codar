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
    TabCur: 0,
    scrollLeft:0,
    listname:[
      {
        title:"团队任务",
        id:0
      },
      {
        title:"个人事项",
        id:1
      }
    ],
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
    checkbox:{},
    curDate:""
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
    if(this.data.TabCur == 0){
      this.getPersonalDailyAssignments(this.data.curDate)
    }
    else{
      this.getPersonalDailyTasks(this.data.curDate)
    }
  },
  showModal(e) {
    console.log(e);
    if(this.data.TabCur==0)
    {
      this.setData({
        assignmentIndex: e.currentTarget.dataset.id,
        checkbox:this.data.assignments[e.currentTarget.dataset.id],
        modalName: e.currentTarget.dataset.target
      })
    }
    else if (this.data.TabCur==1){
      this.setData({
        taskIndex: e.currentTarget.dataset.id,
        checkbox:this.data.tasks[e.currentTarget.dataset.id],
        modalName: e.currentTarget.dataset.target,
        op: e.currentTarget.dataset.op
      })
    }
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

  formDate:function(year, month, day){
    let m = month / 10 < 1 ? '0' + month : '' + month;
    let d = day / 10 < 1 ? '0' + day : '' + day;
    this.setData({
      curDate: year + ':' + m + ':' + d
    })
    return year + ':' + m + ':' + d
  },

  deleteTask:function(e){
    console.log('delete task ' + e.currentTarget.dataset.id)
    let self = this;
    let groupId = this.data.tasks[e.currentTarget.dataset.id].groupID;
    let taskId = this.data.tasks[e.currentTarget.dataset.id].taskID;
    self.hideModal()
    wx.request({
      url: app.globalData.server + 'task/delete',
      data: {
          userID: app.globalData.userID,
          groupID: groupId,
          taskID: taskId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      
      success:function(res){
        console.log('request deleteTask returns: ', res.data)
          
        if (res.data.retCode == 200){
          console.log('Delete task success!')
          wx.showToast({
            title: '取消成功',
            icon: 'none',
            duration: 4000
          })
          self.getPersonalDailyTasks(self.data.curDate)
        }
        else{
          console.log('Delete task fail: ' + res.data.errMsg)
        }
      },
      fail: function(res) {
          console.log('请求失败！' + res.data.errMsg)
      }
    })
  },

  getPersonalDailyAssignments:function(date){
    let self = this;

    wx.request({
      url: app.globalData.server + 'user/assign',
      data: {
          userID: app.globalData.userID,
          date: date
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      
      success:function(res){
        console.log('request getPersonalDailyAssignments returns: ', res.data)
          
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

  getPersonalDailyTasks:function(date){
    let self = this;

    wx.request({
      url: app.globalData.server + 'user/task',
      data: {
        userID: app.globalData.userID,
          date: date
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      
      success:function(res){
        console.log('request getPersonalDailyAssignments returns: ', res.data)
          
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
    if(this.data.TabCur==0){
      this.getPersonalDailyAssignments(this.formDate(e.detail.year, e.detail.month, e.detail.date))
    }
    else{
      this.getPersonalDailyTasks(this.formDate(e.detail.year, e.detail.month, e.detail.date))
    }
  },

  afterCalendarRender:function(e){
    console.log(e.detail.__data__.calendar.selectedDay[0].year)
    console.log(e.detail.__data__.calendar.selectedDay[0].month)
    console.log(e.detail.__data__.calendar.selectedDay[0].day)
    if(this.data.TabCur==0){
      this.getPersonalDailyAssignments(this.formDate(e.detail.__data__.calendar.selectedDay[0].year, e.detail.__data__.calendar.selectedDay[0].month, e.detail.__data__.calendar.selectedDay[0].day))
    }
    else{
      this.getPersonalDailyTasks(this.formDate(e.detail.__data__.calendar.selectedDay[0].year, e.detail.__data__.calendar.selectedDay[0].month, e.detail.__data__.calendar.selectedDay[0].day))
    }
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