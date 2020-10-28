// pages/create_activity/create_activity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupID:1,
    groupName:"initialgroup",
    prior_:[
      0,1,2,3,4
    ],
    content:'',
    title:'',
    prior_index:-1,
    startTime: '00:00',
    startDate: '2020-10-28',
    endTime: '00:00',
    endDate: '2020-10-28',
    users:[
      {
        userID:0,
        checked:false,
        role:1
      },
      {
        userID:1,
        checked:false,
        role:0
      },
      {
        userID:2,
        checked:false,
        role:0
      },
      {
        userID:3,
        checked:false,
        role:0
      },
      {
        userID:4,
        checked:false,
        role:0
      }
    ]
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      prior_index: e.detail.value
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
  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {

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