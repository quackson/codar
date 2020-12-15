// pages/calendar/group_calendar.js
//添加/撤销管理员
//查看群组内所有用户
//更改事务信息
//群组改名
//群组移除用户
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
    groupName: "某团队",
    isAdmin: false,
    assignments:[
      {
        assignmentID: 1,
        assignmentName:"期中考试",
        prior: 0,
        assignToMe:false,
			  startTime:"?",
			  endTime:"?",
        category: 1,
        assignmentContent: "hey",
        executors:[
          {
            userID: 2,
            userName: "user2"
          }
        ]
      },
      {
        assignmentID: 2,
        assignmentName:"期末考试",
        prior: 1,
        assignToMe:false,
			  startTime:"?",
			  endTime:"?",
        category: 1,
        assignmentContent: "hey",
        executors:[
          {
            userID: 2,
            userName: "user2"
          }
        ]
      },
      {
        assignmentID: 3,
        assignmentName:"开会",
        prior: 2,
        assignToMe:false,
			  startTime:"?",
			  endTime:"?",
        category: 1,
        assignmentContent: "hey",
        executors:[
          {
            userID: 2,
            userName: "user2"
          }
        ]
      },
      {
        assignmentID: 4,
        assignmentName:"报告",
        prior: 3,
        assignToMe:false,
			  startTime:"?",
			  endTime:"?",
        category: 1,
        assignmentContent: "hey",
        executors:[
          {
            userID: 2,
            userName: "user2"
          }
        ]
      },
      {
        assignmentID: 5,
        assignmentName:"交互",
        prior: 4,
        assignToMe:false,
			  startTime:"?",
			  endTime:"?",
        category: 1,
        assignmentContent: "hey",
        executors:[
          {
            userID: 2,
            userName: "user2"
          }
        ]
      }
    ],
    checkbox:{}
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
    if(this.data.TabCur == 0){
      this.getGroupDailyAssignments(this.data.curDate)
    }
    else{
      this.getGroupDailyTasks(this.data.curDate)
    }
  },
  showModal(e) {
    console.log(e);
    if(this.data.TabCur==0)
    {
      this.setData({
        assignmentIndex: e.currentTarget.dataset.id,
        checkbox:this.data.assignments[e.currentTarget.dataset.id],
        modalName: e.currentTarget.dataset.target,
        op: e.currentTarget.dataset.op
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

  deleteAssignment:function(e){
    console.log('delete assignment ' + e.currentTarget.dataset.id)
    let self = this;
    let groupId = self.data.groupID;
    let userId = this.data.third_session;
    let assignmentId = this.data.assignments[e.currentTarget.dataset.id].assignmentID;
    self.hideModal()
    wx.request({
      url: app.globalData.server + 'assign/delete',
      data: {
          userID: app.globalData.userID,
          groupID: groupId,
          assignmentID: assignmentId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      
      success:function(res){
        console.log('request deleteAssignment returns: ', res.data)
          
        if (res.data.retCode == 200){
          console.log('Delete assignment success!')
          wx.showToast({
            title: '取消成功',
            icon: 'none',
            duration: 4000
          })
          self.getGroupDailyAssignments(self.data.curDate)
        }
        else{
          console.log('Delete assignment fail: ' + res.data.errMsg)
        }
      },
      fail: function(res) {
          console.log('请求失败！' + res.data.errMsg)
      }
    })
  },

  deleteTask:function(e){
    console.log('delete task ' + e.currentTarget.dataset.id)
    let self = this;
    let groupId = self.data.groupID;
    let taskId = this.data.tasks[e.currentTarget.dataset.id].taskID;
    self.hideModal()
    wx.request({
      url: app.globalData.server + 'task/delete',
      data: {
          userID: self.data.third_session,
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
          self.getGroupDailyTasks(self.data.curDate)
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

  gotocreategroupactivity:function(){
    let selectedDay = this.calendar.getSelectedDay();
    console.log(selectedDay[0])
    let self = this;

    wx.navigateTo({
      url: '../create_activity/create_activity?userid=' + self.data.third_session + '&groupid=' + self.data.groupID + '&groupname=' + self.data.groupName + '&year=' + selectedDay[0].year + '&month=' + selectedDay[0].month + '&day=' + selectedDay[0].day + '&personal=' + 0
    })
  },

  gotocreatepersonaltask:function(){
    let selectedDay = this.calendar.getSelectedDay();
    console.log(selectedDay[0])
    let self = this;

    wx.navigateTo({
      url: '../create_activity/create_activity?userid=' + self.data.third_session + '&groupid=' + self.data.groupID + '&groupname=' + self.data.groupName + '&year=' + selectedDay[0].year + '&month=' + selectedDay[0].month + '&day=' + selectedDay[0].day + '&personal=' + 1
    })
  },

  formDate:function(year, month, day){
    let m = month / 10 < 1 ? '0' + month : '' + month;
    let d = day / 10 < 1 ? '0' + day : '' + day;
    this.setData({
      curDate: year + ':' + m + ':' + d
    })
    return year + ':' + m + ':' + d
  },

  getGroupDailyAssignments:function(date){
    let self = this;

    wx.request({
      url: app.globalData.server + 'group/assign',
      data: {
          groupID: self.data.groupID,
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
      url: app.globalData.server + 'group/task',
      data: {
          groupID: self.data.groupID,
          date: date
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      
      success:function(res){
        console.log('request getGroupDailyTasks returns: ', res.data)
          
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
      this.getGroupDailyAssignments(this.formDate(e.detail.year, e.detail.month, e.detail.date))
    }
    else{
      this.getGroupDailyTasks(this.formDate(e.detail.year, e.detail.month, e.detail.date))
    }
  },

  afterCalendarRender:function(e){
    console.log(e.detail.__data__.calendar.selectedDay[0].year)
    console.log(e.detail.__data__.calendar.selectedDay[0].month)
    console.log(e.detail.__data__.calendar.selectedDay[0].day)
    if(this.data.TabCur==0){
      this.getGroupDailyAssignments(this.formDate(e.detail.__data__.calendar.selectedDay[0].year, e.detail.__data__.calendar.selectedDay[0].month, e.detail.__data__.calendar.selectedDay[0].day))
    }
    else{
      this.getGroupDailyTasks(this.formDate(e.detail.__data__.calendar.selectedDay[0].year, e.detail.__data__.calendar.selectedDay[0].month, e.detail.__data__.calendar.selectedDay[0].day))
    }
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