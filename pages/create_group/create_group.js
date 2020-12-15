// pages/create_group/create_group.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    result:-1,
    NavCur:'',
    groupName:"",
    searchresult:'0',
    members:[      
      'ME<leader>'
      /*
      'mem2',
      'mem2',
      'mem3',
      'mem4',
      'mem5',
      'mem6'
      */
    ],
    newMemberid:'',
    newMemberName:'',
    interactionMems:''
  },
  groupNameInput(e){
    this.setData({
      groupName: e.detail.value
    });
  },
  memNameInput(e){
    this.setData({
      newMemberid: e.detail.value     
    });
    //console.log(this.data.newMember)
  },
  searchUser(e){
    let app_=app
    let this_=this
    if(this_.data.newMemberid==app.globalData.userID)
    {
      this_.setData({
        newMemberName:'',
        searchresult:2,
        modalName: e.currentTarget.dataset.target
      })
    }
    else{
      wx.request({
        url: app.globalData.server+'/user/info',
        data:{      
          userID:this_.data.newMemberid
        },
        method:"GET",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res){
          //this_.globalData.userID=res.data.userID
          if (res.data.retCode==200){
            this_.setData({
              newMemberName:res.data.userName,
              searchresult:1,
              modalName: e.currentTarget.dataset.target
            })
          }
          else{
            this_.setData({
              newMemberName:'',
              searchresult:0,
              modalName: e.currentTarget.dataset.target
            })
          }
        }
      })
    }
    
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
  deleteMember(e){

  },
  createGroup(e){
    let app_=app
    let this_=this
    wx.request({
      url: app.globalData.server+'/group/build',
      data:{      
        userID:app.globalData.userID,
        groupName:this_.data.groupName
      },
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){
        //this_.globalData.userID=res.data.userID
        if (res.data.retCode==200){
          var groupid=res.data.groupID
          console.log(groupid)
          wx.request({
            url: app.globalData.server+'/group/multiInvite',
            data:{      
              userID:app.globalData.userID,
              groupID:groupid,
              invitedUserIDs:this_.data.interactionMems
            },
            method:"POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res){
              //this_.globalData.userID=res.data.userID
              if (res.data.retCode==200){
                this_.setData({
                  members:['ME<leader>'],
                  newMemberid:'',
                  newMemberName:''
                })               
                console.log("创建团队");
                this_.setData({
                  modalName: 'created',
                  result:1
                })
              }
              else{
                this_.setData({
                  modalName: 'created',
                  result:0
                })
              }
            },
            fail(res){
              this.setData({
                modalName: 'created',
                result:0
              })
            }
          })
        }
        
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