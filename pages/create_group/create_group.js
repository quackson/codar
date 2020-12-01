// pages/create_group/create_group.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    NavCur:'',
    groupName:"",
    members:[      
      'ME<leader>',
      'mem2',
      'mem2',
      'mem3',
      'mem4',
      'mem5',
      'mem6'
      
    ],
    newMember:''
  },
  groupNameInput(e){
    this.setData({
      groupName: e.detail.value
    });
  },
  memNameInput(e){
    this.setData({
      newMember: e.detail.value     
    });
    console.log(this.data.newMember)
  },
  sendInvitation(e){
    var temp=this.data.members;
    temp.push(this.data.newMember);
    this.setData({
      members: temp  
    });
    console.log(this.data.members);
  },
  createGroup(e){
    console.log("创建团队");
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