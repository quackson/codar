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
    assignments:[
      {
        groupName:"个人",
        assignmentName:"期中考试",
        priority_icon:"cuIcon-form line-red",
			  startTime:"?",
			  endTime:"?",
			  content:"test",
        prior:1,
        checked:false
      },
      {
        groupName:"实验室",
        assignmentName:"pre",
        priority_icon:"cuIcon-form line-blue",
			  startTime:"?",
			  endTime:"?",
			  content:"test",
			  prior:2,
        checked:false
      }
    ],
    checkbox:{}
  },
  showModal(e) {
    console.log(e);
    this.setData({
      checkbox:this.data.assignments[e.currentTarget.dataset.id],
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