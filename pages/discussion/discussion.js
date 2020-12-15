// pages/discussion/discussion.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:-1,
    groupID:-1,
    groupName:'',
    pendingTasks:[
      /*
      {
        userID:0,
        userName:'User1',
        pendingTaskID:0,
        pendingTaskName:'proposal1',
        startTime:'2020:08:01:00:00',
        endTime:'2020:12:20:12:00',
        pendingTaskContent:'完成前端的编写',
        voteNum:3,
        myvote:0
      },
      {
        userID:1,
        userName:'User2',
        pendingTaskID:1,
        pendingTaskName:'proposal2',
        startTime:'2020:08:01:00:00',
        endTime:'2020:12:20:12:00',
        pendingTaskContent:'完成后端的编写',
        voteNum:2,
        myvote:1
      },
      {
        userID:2,
        userName:'User3',
        pendingTaskID:2,
        pendingTaskName:'proposal3',
        startTime:'2020:08:01:00:00',
        endTime:'2020:12:20:12:00',
        pendingTaskContent:'完成前后端交互部分',
        voteNum:5,
        myvote:2
      }
      */
    ],
    content:''
  },
  textareaBInput(e){
    this.setData({
      content: e.detail.value
    });
  },
  createProposal(e){
    let this_=this
    let app_=app
    wx.request({
      url: app.globalData.server+'/pendingTask/add',
      data:{      
        userID:app.globalData.userID,
        groupID:this_.data.groupID,
        pendingTaskContent:this_.data.content
      },
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){
        if(res.data.retCode==200){
          this_.setData({
            content:''
          })
          console.log("create proposal success")
          wx.request({
            url: app.globalData.server+'/group/pendingTask',
            data:{      
              userID:app.globalData.userID,
              groupID:this_.data.groupID
            },
            method:"GET",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res){
              if(res.data.retCode==200){
                var tasks=[]
                for(var i=0;i<res.data.pendingTasks.length;i++){
                  var temp={
                    userID:'',
                    userName:'',
                    pendingTaskID:'',
                    pendingTaskName:'',
                    startTime:'',
                    endTime:'',
                    pendingTaskContent:'',
                    voteNum:'',
                    voted:0,
                    myvote:0,
                  }
                  temp['userID']=res.data.pendingTasks[i]['userID']
                  temp['userName']=res.data.pendingTasks[i]['userName']
                  temp['pendingTaskName']=res.data.pendingTasks[i]['pendingTaskName']
                  temp['pendingTaskID']=res.data.pendingTasks[i]['pendingTaskID']
                  temp['startTime']=res.data.pendingTasks[i]['startTime']
                  temp['endTime']=res.data.pendingTasks[i]['endTime']
                  temp['pendingTaskContent']=res.data.pendingTasks[i]['pendingTaskContent']
                  temp['voteNum']=res.data.pendingTasks[i]['voteNum']
                  if(res.data.pendingTasks[i]['voted']=='1'){
                    temp['myvote']=1
                  }
                  tasks.push(temp)
                }
                this_.setData({
                  pendingTasks:tasks
                })
                console.log(this_.data.pendingTasks)
      
              }
            }
          })
        }
      }
    })
  },
  voteYes(e){
    let app_=app
    let this_=this
    var index=e.currentTarget.dataset.id  
    console.log(e)  
    console.log(this_.data.pendingTasks[index])
    if(this_.data.pendingTasks[index]['myvote']=='1')
    {
      return
    }
    wx.request({
      url: app.globalData.server+'/pendingTask/vote',
      data:{      
        userID:app.globalData.userID,
        groupID:this_.data.groupID,
    	  pendingTaskID:this_.data.pendingTasks[index]['pendingTaskID'],
	      vote:1
      },
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){
        if(res.data.retCode==200){
          var temp=this_.data.pendingTasks
          temp[index]['myvote']=1
          this_.setData({
            pendingTasks:temp
          })
        }
      }
    })
    
  },
  voteNo(e){
    console.log("No")
    let app_=app
    let this_=this
    var index=e.currentTarget.dataset.id  
    console.log(e)  
    console.log(this_.data.pendingTasks[index])
    if(this_.data.pendingTasks[index]['myvote']=='2')
    {
      return
    }
    wx.request({
      url: app.globalData.server+'/pendingTask/vote',
      data:{      
        userID:app.globalData.userID,
        groupID:this_.data.groupID,
    	  pendingTaskID:this_.data.pendingTasks[index]['pendingTaskID'],
	      vote:-1
      },
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){
        if(res.data.retCode==200){
          var temp=this_.data.pendingTasks
          temp[index]['myvote']=2
          this_.setData({
            pendingTasks:temp
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
      case 'groupList':
        wx.redirectTo({
          url: '../group_list/group_list' //?userid=
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
      groupID:options.groupid    
    })
    let app_=app
    let this_=this
    wx.request({
      url: app.globalData.server+'/user/info',
      data:{      
        userID:app.globalData.userID
      },
      method:"GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){
        this_.setData({
          userName:res.data.userName
        })
      }
    })
    wx.request({
      url: app.globalData.server+'/group/pendingTask',
      data:{      
        userID:app.globalData.userID,
        groupID:options.groupid
      },
      method:"GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){
        if(res.data.retCode==200){
          var tasks=[]
          for(var i=0;i<res.data.pendingTasks.length;i++){
            var temp={
              userID:'',
              userName:'',
              pendingTaskID:'',
              pendingTaskName:'',
              startTime:'',
              endTime:'',
              pendingTaskContent:'',
              voteNum:'',
              voted:0,
              myvote:0,
            }
            temp['userID']=res.data.pendingTasks[i]['userID']
            temp['userName']=res.data.pendingTasks[i]['userName']
            temp['pendingTaskName']=res.data.pendingTasks[i]['pendingTaskName']
            temp['pendingTaskID']=res.data.pendingTasks[i]['pendingTaskID']
            temp['startTime']=res.data.pendingTasks[i]['startTime']
            temp['endTime']=res.data.pendingTasks[i]['endTime']
            temp['pendingTaskContent']=res.data.pendingTasks[i]['pendingTaskContent']
            temp['voteNum']=res.data.pendingTasks[i]['voteNum']
            if(res.data.pendingTasks[i]['voted']=='1'){
              temp['myvote']=1
            }
            tasks.push(temp)
          }
          this_.setData({
            pendingTasks:tasks
          })
          console.log(this_.data.pendingTasks)

        }
      }
    })
    console.log('userid: '+options.userid)
    console.log('groupid: '+options.groupid)
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