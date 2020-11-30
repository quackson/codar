// pages/information/information.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openID:'',
    userID:null,
    TabCur: 0,
    scrollLeft:0,
    listname:[
      {
        title:"待接收邀请",
        id:0
      },
      {
        title:"待接收任务",
        id:1
      },
      {
        title:"已发出邀请",
        id:2
      },
      {
        title:"已分配任务",
        id:3
      },
    ],
    invatation:[
      /*{
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
        groupName:"Group7"
      }*/
    ],
    myInvatation:[
      /*{
        groupID:1,
        groupName:"Group1",
        acceptUsers:[
          'user1',
          'user2'
        ]
      },
      {
        groupID:2,
        groupName:"Group2",
        acceptUsers:[
          'user1',
          'user2'
        ]
      },      
      {
        groupID:3,
        groupName:"Group3",
        acceptUsers:[
          'user1',
          'user2'
        ]
      },
      {
        groupID:4,
        groupName:"Group4",
        acceptUsers:[
          'user1',
          'user2'
        ]
      },
      {
        groupID:5,
        groupName:"Group5",
        acceptUsers:[
          'user1',
          'user2'
        ]
      },
      {
        groupID:6,
        groupName:"Group6",
        acceptUsers:[
          'user1',
          'user2'
        ]
      },
      {
        groupID:7,
        groupName:"Group7",
        acceptUsers:[
          'user1',
          'user2'
        ]
      },
      {
        groupID:8,
        groupName:"Group8",
        acceptUsers:[
          'user1',
          'user2'
        ]
      },
      {
        groupID:9,
        groupName:"Group7",
        acceptUsers:[
          'user1',
          'user2'
        ]
      }*/
    ],
    newtask:[
      /*{
        groupID:1,
     		assignmentID:2,
			  startTime:"?",
			  endTime:"?",
			  content:"test",
        prior:1,
        checked:false
      },
      {
        groupID:2,
     		assignmentID:2,
			  startTime:"?",
			  endTime:"?",
			  content:"test",
			  prior:2,
        checked:false
      }*/
    ],
    mydelivertask:[
      /*{
        groupID:1,
     		assignmentID:2,
			  startTime:"?",
			  endTime:"?",
			  content:"test",
        prior:1,
        checked:false,
        acceptmembers:[
          'mem1',
          'mem2',
          'mem3'
        ]
      },
      {
        groupID:2,
     		assignmentID:2,
			  startTime:"?",
			  endTime:"?",
			  content:"test",
			  prior:2,
        checked:false,
        acceptmembers:[
          'mem1',
          'mem2',
          'mem3'
        ]
      }*/
    ],
    checkbox:{}
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
  },
  showModal(e) {
    console.log(e);
    if (this.data.TabCur==1){
      this.setData({
      checkbox:this.data.newtask[e.currentTarget.dataset.id],
      modalName: e.currentTarget.dataset.target
    })
    }
    else if (this.data.TabCur==2){
      this.setData({
        checkbox:this.data.myInvatation[e.currentTarget.dataset.id],
        modalName: e.currentTarget.dataset.target
      })
      if (e.currentTarget.dataset.sub=="1")
      {
        let app_=app
        var temp={
          groupID:'',
          groupName:'',
          accepts:''
        }
        let this_=this
        wx.request({
          url: app.globalData.server+'/group/invitation',
          data:{      
            groupID:this_.data.checkbox['groupID']
          },
          method:"GET",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res){
          for(var i=0;i<res.data.users.length;i++)
          {
            console.log(res.data.users[i]['userName'])
            temp['accepts']+=res.data.users[i]['userName']
            if(i!=res.data.users.length-1)
              temp['accepts']+=';'
          }
          temp['groupID']=this_.data.checkbox['groupID']
          temp['groupName']=this_.data.checkbox['groupName']
          this_.setData({
            checkbox:temp
          })
          }
        })        
      }
    }
    else if (this.data.TabCur==3){
      this.setData({
        checkbox:this.data.mydelivertask[e.currentTarget.dataset.id],
        modalName: e.currentTarget.dataset.target
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
      openID:app.globalData.openID,
      userID:app.globalData.userID
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
    let app_=app
    let this_=this
    wx.request({
      url: app.globalData.server+'/user/groupInvitation',
      data:{      
        userID:app.globalData.userID
      },
      method:"GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){
      //console.log(res)
        this_.setData({
          invatation:res.data.groups
        })
      }
      })
    wx.request({
        url: app.globalData.server+'/user/assignInvitation',
        data:{      
          userID:app.globalData.userID
        },
        method:"GET",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res){
        //console.log(res)
        this_.setData({
          newtask:res.data.assignments
        })
        }
        })
      wx.request({
          url: app.globalData.server+'/user/adminGroup',
          data:{      
            userID:app.globalData.userID
          },
          method:"GET",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res){
          //console.log(res)
          this_.setData({
            myInvatation:res.data.groups
          })
          }
          })
        wx.request({
            url: app.globalData.server+'/user/ownAssign',
            data:{      
              userID:app.globalData.userID
            },
            method:"GET",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res){
            //console.log(res)
            this_.setData({
              mydelivertask:res.data.assignments
            })
            }
        })
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