// pages/create_activity/create_activity.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    NavCur:'',
    groupName:"",
    groupID:"",
    prior_:[
      0,1,2,3,4
    ],
    type_:[
      '是【时间段型】',
      '否【DDL型】'
    ],
    content:'',
    title:'',
    prior_index:-1,
    taskType_index:-1,
    startTime: '00:00',
    startDate: '2020-10-28',
    endTime: '00:00',
    endDate: '2020-10-28',
    users:[
      /*
      {
        userID:'ID1',
        checked:false,
        role:1
      },
      {
        userID:'ID2',
        checked:false,
        role:0
      },
      {
        userID:'ID3',
        checked:false,
        role:0
      },
      {
        userID:'ID4',
        checked:false,
        role:0
      }
      */
    ]
  },
  PickerChange(e) {
    //console.log(e);
    this.setData({
      prior_index: e.detail.value
    })
  },
  taskTypeChange(e) {
    //console.log(e);
    this.setData({
      taskType_index: e.detail.value
    })
  },
  startTimeChange(e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  startDateChange(e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  endTimeChange(e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  endDateChange(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  titleInput(e){
    this.setData({
      title: e.detail.value
    });
  },
  contentInput(e){
    this.setData({
      content: e.detail.value
    });
  },
  checkboxChange(e){
    //console.log(e);
    let temp=this.data.users[e.target.dataset.index]['checked'];
    this.data.users[e.target.dataset.index]['checked']=!temp;
    //console.log(this.data.users[e.target.dataset.index]['checked']);
  },  
  createactivity(e){
    let this_=this
    let app_=app
    var startT=this_.data.startDate.replace('-',':')+':'+this_.data.startTime.replace('-',':')
    var endT=this_.data.endDate.replace('-',':')+':'+this_.data.endTime.replace('-',':')
    console.log(startT)
    console.log(endT)
    wx.request({
      url: app.globalData.server+'/assign/add',
      data:{      
        userID:app_.globalData.userID,
	      groupID:this_.data.groupID,
	      assignmentName:this_.data.title,
	      category:this_.data.taskType_index+1,
        prior:this_.data.prior_index,
        startTime:startT,
        endTime:endT
      },
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){  
        var taskid=res.data.assignmentID
        var userinvite=''
        for(var i=0;i<this_.data.users.length;i++){
          if(this_.data.users[i]['checked']){
            if(userinvite==''){
              userinvite+=this_.data.users[i]['userID']
            }
            else{
              userinvite+=('#'+this_.data.users[i]['userID'])
            }
          }
        }
        console.log(userinvite)
        if(res.data.retCode=='200'){
          wx.request({
            url: app.globalData.server+'/assign/multiInvite',
            data:{
              userID:app.globalData.userID,
              groupID:this_.data.groupID, 
              assignmentID:taskid,
              invitedUserIDs:userinvite
            },
            method:"POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res){  
              if(res.data.retCode=='200'){
                console.log("create activity success!")
              }
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
      NavCur: app.globalData.NavCur,
      groupID:options.groupid,
      groupName:options.groupname,
      //personal:options.personal
      personal:0,
      startDate:options.year+'-'+options.month+'-'+options.day,
      endDate:options.year+'-'+options.month+'-'+options.day
    })
    let app_=app
    let this_=this
    wx.request({
      url: app.globalData.server+'/group/user',
      data:{      
        groupID:this_.data.groupID
      },
      method:"GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){  
        console.log(res) 
        
        let tempusers=[]
        for(var i=0;i<res.data.users.length;i++){
          var tempuser={
            userID:0,
            userName:'',
            role:-1,
            checked:false
          }
          tempuser['userID']=res.data.users[i]['userID']
          tempuser['userName']=res.data.users[i]['userName']
          tempuser['role']=res.data.users[i]['role']
          console.log(tempuser)
          tempusers.push(tempuser)
        }
        this_.setData({
          users:tempusers
        })
        console.log(this_.data.users)
      }
    })

    console.log('userid: ' + options.userid)
    console.log('groupid: ' + options.groupid)
    console.log('groupname: ' + options.groupname)
    console.log('year: ' + options.year)
    console.log('month: ' + options.month)
    console.log('day: ' + options.day)
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