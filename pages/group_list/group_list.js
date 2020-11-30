// pages/group_list/group_list.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft:0,
    NavCur: app.globalData.NavCur,
    listname:[
      {
        title:"我创建的",
        id:0
      },
      {
        title:"我加入的",
        id:1
      }
    ],
    created_groups:[
      {
        groupID:1,
        groupName:"Group1"
      },
      {
        groupID:2,
        groupName:"Group2"
      },      
      {
        groupID:3,
        groupName:"Group3"
      },
      {
        groupID:4,
        groupName:"Group4"
      },
      {
        groupID:5,
        groupName:"Group5"
      },
      {
        groupID:6,
        groupName:"Group6"
      },
      {
        groupID:7,
        groupName:"Group7"
      },
      {
        groupID:8,
        groupName:"Group8"
      },
      {
        groupID:9,
        groupName:"Group9"
      },
      {
        groupID:10,
        groupName:"Group10"
      }
    ],
    joined_groups:[
      {
        groupID:1,
        groupName:"Group1",
        creatorName:"abc"
      },
      {
        groupID:2,
        groupName:"Group2",
        creatorName:"小明"
      },      
      {
        groupID:3,
        groupName:"Group3",
        creatorName:"a_老师"
      }
    ],
    checkbox:{},
    third_session: 1
  },
  getAdminGroup:function(){
    let third_session = this.data.third_session;
    let self = this;
    wx.request({
      url: app.globalData.server + 'user/adminGroup',
      data: {
          userID: third_session
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      
      success:function(res){
          console.log('request getAdminGroup returns: ', res.data)
          
          if (res.data.retCode == 200){
            let list = self.data.created_groups;
            if (typeof res.data.groups !== "undefined"){
              list = res.data.groups
            }
            
            self.setData({
                created_groups: list
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
  getJoinedGroup:function(){
    let third_session = this.data.third_session;
    let self = this;
    wx.request({
      url: app.globalData.server + 'user/group',
      data: {
          userID: third_session
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      
      success:function(res){
        console.log('request getJoinedGroup returns: ', res.data)
          
        if (res.data.retCode == 200){
          let list = self.data.joined_groups;
          if (typeof res.data.groups !== "undefined"){
            list = res.data.groups
          }
          
          self.setData({
              joined_groups: list
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
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
    let self = this;
    if(this.data.TabCur == 0){
      self.getAdminGroup()
    }
    else{
      self.getJoinedGroup()
    }
  },
  showModal(e) {
    console.log(e);
    this.setData({
      checkbox:this.data.newtask[e.currentTarget.dataset.id],
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  gotogroupcalendar:function(e){
    let self = this;
    console.log(e.currentTarget.dataset.groupname)

    wx.navigateTo({
      url: '../calendar/group_calendar?userid=' + self.data.third_session + '&groupid=' + e.currentTarget.dataset.groupid + '&groupname=' + e.currentTarget.dataset.groupname + '&isadmin=' + e.currentTarget.dataset.isadmin
    })
  },
  gotodiscussboard:function(e){
    console.log('goto group discussion board!')
    let self = this;

    wx.navigateTo({
      url: '../discussion/discussion?userid=' + self.data.third_session + '&groupid=' + e.currentTarget.dataset.groupid
    })
  },
  exitgroup:function(){
    console.log('exit group!')
    //TODO
  },
  deletegroup:function(){
    console.log('delete group!')
    //TODO
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
    let self = this;
    self.getAdminGroup()
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
    let self = this;
    if(this.data.TabCur == 0){
      self.getAdminGroup()
    }
    else{
      self.getJoinedGroup()
    }
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