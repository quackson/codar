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
    sub:0,
    scrollLeft:0,
    waiting:[],
    listname:[
      {
        title:"群邀请",
        id:0
      },
      {
        title:"新任务",
        id:1
      },
      {
        title:"退群",
        id:2
      },
      {
        title:"群邀请",
        id:3
      },
      {
        title:"新任务",
        id:4
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
    checkbox:{},
    checkID:-1
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
  },
  refineQuitInformation(e){
    let this_=this
    var quittemp=[]
    wx.request({
      url: app.globalData.server+'/user/checkNotice',
      data:{      
        groupID:this_.data.myquitinformation[e.currentTarget.dataset.id]['groupID'],
        userID:this_.data.userID
      },
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){
        //console.log(e)
        for(var i=0;i<this_.data.myquitinformation.length;i++)
        {
          if(i!=e.currentTarget.dataset.id)
          {
            quittemp.push(this_.data.myquitinformation[i])
          }
        }
        //console.log(newTasktemp)
        this_.setData({
          myquitinformation:quittemp
        })
        //console.log(this_.data.newtask)
      }
    })
  },
  rejectTask(e){
    //console.log(this.data.checkID)
    let this_=this
    var newTasktemp=[]
    wx.request({
      url: app.globalData.server+'/assign/join',
      data:{      
        groupID:this_.data.newtask[this_.data.checkID]['groupID'],
        userID:this_.data.userID,
        assignmentID:this_.data.newtask[this_.data.checkID]['assignmentID'],
        operation:-1
      },
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){
        //console.log(e)
        for(var i=0;i<this_.data.newtask.length;i++)
        {
          if(i!=this_.data.checkID)
          {
            newTasktemp.push(this_.data.newtask[i])
          }
        }
        //console.log(newTasktemp)
        this_.setData({
          newtask:newTasktemp,
          modalName:null
        })
        //console.log(this_.data.newtask)
      }
    })
  },
  acceptTask(e){
    //console.log(this.data.checkID)
    let this_=this
    var newTasktemp=[]
    wx.request({
      url: app.globalData.server+'/assign/join',
      data:{      
        groupID:this_.data.newtask[this_.data.checkID]['groupID'],
        userID:this_.data.userID,
        assignmentID:this_.data.newtask[this_.data.checkID]['assignmentID'],
        operation:1
      },
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){
        //console.log(e)
        for(var i=0;i<this_.data.newtask.length;i++)
        {
          if(i!=this_.data.checkID)
          {
            newTasktemp.push(this_.data.newtask[i])
          }
        }
        //console.log(newTasktemp)
        this_.setData({
          newtask:newTasktemp,
          modalName:null
        })
        //console.log(this_.data.newtask)
      }
    })
  },
  rejectGroupInvatation(e){
    //console.log(this.data.checkID)
    let this_=this
    var invatationtemp=[]
    wx.request({
      url: app.globalData.server+'/group/join',
      data:{      
        groupID:this_.data.invatation[this_.data.checkID]['groupID'],
        userID:this_.data.userID,
        operation:-1
      },
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){
        //console.log(e)
        for(var i=0;i<this_.data.invatation.length;i++)
        {
          if(i!=this_.data.checkID)
          {
            invatationtemp.push(this_.data.invatation[i])
          }
        }
        //console.log(newTasktemp)
        this_.setData({
          invatation:invatationtemp,
          modalName:null
        })
        //console.log(this_.data.newtask)
      }
    })
  },
  acceptGroupInvatation(e){
    //console.log(this.data.checkID)
    let this_=this
    var invatationtemp=[]
    wx.request({
      url: app.globalData.server+'/group/join',
      data:{      
        groupID:this_.data.invatation[this_.data.checkID]['groupID'],
        userID:this_.data.userID,
        operation:1
      },
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){
        //console.log(e)
        for(var i=0;i<this_.data.invatation.length;i++)
        {
          if(i!=this_.data.checkID)
          {
            invatationtemp.push(this_.data.invatation[i])
          }
        }
        //console.log(newTasktemp)
        this_.setData({
          invatation:invatationtemp,
          modalName:null
        })
        //console.log(this_.data.newtask)
      }
    })
  },
  truncateGroup(e){
    //console.log(this.data.checkID)
    let this_=this
    var myInvatationtemp=[]
    wx.request({
      url: app.globalData.server+'/group/delete',
      data:{      
        groupID:this_.data.myInvatation[this_.data.checkID]['groupID'],
        userID:this_.data.userID
      },
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){
        //console.log(e)
        for(var i=0;i<this_.data.myInvatation.length;i++)
        {
          if(i!=this_.data.checkID)
          {
            myInvatationtemp.push(this_.data.myInvatation[i])
          }
        }
        //console.log(newTasktemp)
        this_.setData({
          myInvatation:myInvatationtemp,
          modalName:null
        })
        //console.log(this_.data.newtask)
      }
    })
  },
  truncateTask(e){
    //console.log(this.data.checkID)
    let this_=this
    var mydelivertasktemp=[]
    wx.request({
      url: app.globalData.server+'/assign/delete',
      data:{      
        groupID:this_.data.mydelivertask[this_.data.checkID]['groupID'],
        userID:this_.data.userID,
        taskID:this_.data.mydelivertask[this_.data.checkID]['assignmentID']
      },
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){
        //console.log(e)
        for(var i=0;i<this_.data.mydelivertask.length;i++)
        {
          if(i!=this_.data.checkID)
          {
            mydelivertasktemp.push(this_.data.mydelivertask[i])
          }
        }
        //console.log(newTasktemp)
        this_.setData({
          mydelivertask:mydelivertasktemp,
          modalName:null
        })
        //console.log(this_.data.newtask)
      }
    })
  },
  showModal(e) {
    console.log(e);
    if(this.data.TabCur==0)
    {
      this.setData({
      checkbox:this.data.invatation[e.currentTarget.dataset.id],
      modalName: e.currentTarget.dataset.target,
      sub:e.currentTarget.dataset.sub,
      checkID:e.currentTarget.dataset.id
      })
    }
    else if (this.data.TabCur==1){
      this.setData({
      checkbox:this.data.newtask[e.currentTarget.dataset.id],
      modalName: e.currentTarget.dataset.target,
      sub:e.currentTarget.dataset.sub,
      checkID:e.currentTarget.dataset.id
    })
    }
    else if (this.data.TabCur==3){
      this.setData({
        checkbox:this.data.myInvatation[e.currentTarget.dataset.id],
        modalName: e.currentTarget.dataset.target,
        sub:e.currentTarget.dataset.sub,
        checkID:e.currentTarget.dataset.id
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
            var tempwait=[]
          for(var i=0;i<res.data.users.length;i++)
          {
            console.log(res.data.users[i]['userName'])
            temp['accepts']+=res.data.users[i]['userName']
            tempwait.push(res.data.users[i]['userName'])
            if(i!=res.data.users.length-1)
              temp['accepts']+=';'
          }
          temp['groupID']=this_.data.checkbox['groupID']
          temp['groupName']=this_.data.checkbox['groupName']
          this_.setData({
            checkbox:temp,
            waiting:tempwait
          })
          console.log(this_.data.waiting)
          }
        })        
      }
    }
    else if (this.data.TabCur==4){
      this.setData({
        checkbox:this.data.mydelivertask[e.currentTarget.dataset.id],
        modalName: e.currentTarget.dataset.target,        
        sub:e.currentTarget.dataset.sub,
        checkID:e.currentTarget.dataset.id
      })
      //console.log(this.data.checkbox)
      if (e.currentTarget.dataset.sub=="1")
      {
        let app_=app
        var temp={
          assignmentName:'',
          groupName:'',
          accepts:'已接受组员：',
          startTime:'',
          endTime:''
        }
        let this_=this
        wx.request({
          url: app.globalData.server+'/assign/info',
          data:{      
            groupID:this_.data.checkbox['groupID'],
            assignmentID:this_.data.checkbox['assignmentID']
          },
          method:"GET",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res){
            var tempwait=[]
            for(var i=0;i<res.data.executors.length;i++)
            {
              temp['accepts']+=res.data.executors[i]['userName']
              tempwait.push(res.data.executors[i]['userName'])
              if(i!=res.data.executors.length-1)
                temp['accepts']+=';'
            }
            temp['assignmentName']=res.data.assignmentName
            temp['groupName']=res.data.groupName
            temp['startTime']=res.data.startTime
            temp['endTime']=res.data.endTime
            this_.setData({
              checkbox:temp,
              waiting:tempwait
            })
            console.log(this_.data.checkbox)
          }
        })        
      }
    }
  },
  hideModal(e) {
    this.setData({
      modalName: null,
      waiting:[]
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
            console.log(this_.data.mydelivertask)
            }
        })
        wx.request({
          url: app.globalData.server+'/user/notice',
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
            myquitinformation:res.data.groups
          })
          console.log(this_.data.myquitinformation)
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