// pages/group_info/add_member.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupName: "某团队",
    result:-1,
    searchresult:0,
    members:[],
    newMemberid:'',
    newMemberName:'',
    interactionMems:''
  },

  memNameInput(e){
    this.setData({
      newMemberid: e.detail.value     
    });
    //console.log(this.data.newMember)
  },

  searchUser(e){
    let app_=app
    let self=this
    if(self.data.newMemberid==app.globalData.userID)
    {
      self.setData({
        newMemberName:'',
        searchresult:2,
        modalName: e.currentTarget.dataset.target
      })
    }
    else{
      wx.request({
        url: app.globalData.server+'/user/info',
        data:{      
          userID:self.data.newMemberid
        },
        method:"GET",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res){
          //self.globalData.userID=res.data.userID
          if (res.data.retCode==200){
            self.setData({
              newMemberName:res.data.userName,
              searchresult: 1,
              modalName: e.currentTarget.dataset.target
            })
            console.log(self.data.searchresult)
          }
          else{
            self.setData({
              newMemberName:'',
              searchresult:0,
              modalName: e.currentTarget.dataset.target
            })
          }
        }
      })
    }
    console.log(self.data.searchresult)
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  addMember(e){
    var temp=this.data.members;
    temp.push(this.data.newMemberName);
    var premem=this.data.interactionMems
    this.data.interactionMems=(premem=='')?premem+this.data.newMemberid:premem+'#'+this.data.newMemberid
    this.setData({
      members: temp,
      searchresult:0,
      modalName:null,
      newMemberName:'',
      newMemberid:''
    });
    console.log(this.data.members);
  },

  requestAddMember(e){
    let app_=app
    let this_=this
    console.log(this_.data.interactionMems)
    wx.request({
      url: app.globalData.server+'/group/multiInvite',
      data:{      
        userID:this_.data.third_session,
        groupID:this_.data.groupID,
        invitedUserIDs:this_.data.interactionMems
      },
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){
        console.log(res.data)
        if (res.data.retCode==200){
          console.log(1)
          this_.setData({
            members:[],
            newMemberid:'',
            newMemberName:''
          })               
          this_.setData({
            modalName: 'created',
            result:1
          })
        }
        else{
          console.log(2)
          this_.setData({
            modalName: 'created',
            result:0
          })
        }
      },
      fail(res){
        console.log(3)
        this.setData({
          modalName: 'created',
          result:0
        })
      }
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
    console.log(options)
    this.setData({
      NavCur: app.globalData.NavCur,
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