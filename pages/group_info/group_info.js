// pages/group_info/group_info.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupName: "某团队",
    role: undefined,
    members: [],
    setManager: 0,
    checkbox:{},
    inputChangeName: false
  },

  showModal(e) {
    console.log(e);
    this.setData({
      checkbox:this.data.members[e.currentTarget.dataset.id],
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  groupNameInput(e){
    this.setData({
      newGroupName: e.detail.value
    });
  },

  inputchangename:function(){
    let prev = this.data.inputChangeName;
    this.setData({
      inputChangeName: !prev
    })
  },

  changename:function(){
    console.log('change name')
    let third_session = this.data.third_session;
    let groupId = this.data.groupID;
    let groupName = this.data.newGroupName;
    let self = this;

    wx.request({
      url: app.globalData.server + 'group/changeName',
      data: {
          userID: third_session,
          groupID: groupId,
          groupName: groupName
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      
      success:function(res){
        console.log('request changename returns: ', res.data)
          
        if (res.data.retCode == 200){
          console.log('Change name success!')
          self.setData({
            groupName: res.data.groupName,
            inputChangeName: false
          })
        }
        else{
          console.log('Change name fail: ' + res.data.errMsg)
          wx.showToast({
            title: '更改失败',
            icon: 'none',
            duration: 4000
          })
        }
      },
      fail: function(res) {
          console.log('请求失败！' + res.data.errMsg)
      }
    })
  },

  gotosetmanager:function(){
    let prev = this.data.setManager;
    this.setData({
      setManager: 1 - prev
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

  gotoaddmember:function(){
    console.log('add member')
    let self = this;
    wx.navigateTo({
      url: '../group_info/add_member?userid=' + self.data.third_session + '&groupid=' + self.data.groupID + '&groupname=' + self.data.groupName
    })
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

  deletemember:function(e){
    console.log('delete member')
    let third_session = this.data.third_session;
    let groupId = this.data.groupID;
    let memberId = e.currentTarget.dataset.id;
    let self = this;
    self.hideModal()
    wx.request({
      url: app.globalData.server + 'group/deleteMember',
      data: {
          userID: third_session,
          groupID: groupId,
          memberID: memberId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      
      success:function(res){
        console.log('request deletemember returns: ', res.data)
          
        if (res.data.retCode == 200){
          console.log('Delete member success!')
          wx.showToast({
            title: '删除成功',
            icon: 'none',
            duration: 4000
          })
          self.getMembers()
        }
        else{
          console.log('Delete member fail: ' + res.data.errMsg)
        }
      },
      fail: function(res) {
          console.log('请求失败！' + res.data.errMsg)
      }
    })
  },

  setmanager:function(e){
    console.log('set manager')
    let third_session = this.data.third_session;
    let groupId = this.data.groupID;
    let managerId = e.currentTarget.dataset.managerid;
    let operation = e.currentTarget.dataset.operation;
    let self = this;

    wx.request({
      url: app.globalData.server + 'group/manager',
      data: {
          userID: third_session,
          groupID: groupId,
          managerID: managerId,
          operation: operation
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      
      success:function(res){
        console.log('request setmanager returns: ', res.data)
          
        if (res.data.retCode == 200){
          console.log('Set manager success!')
          wx.showToast({
            title: '设置成功',
            icon: 'none',
            duration: 4000
          })
          if (typeof res.data.users !== "undefined"){
            self.setData({
              members: res.data.users
            })
          }
        }
        else{
          console.log('Set manager fail: ' + res.data.errMsg)
        }
      },
      fail: function(res) {
          console.log('请求失败！' + res.data.errMsg)
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
      role: options.role,
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