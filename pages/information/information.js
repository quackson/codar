// pages/information/information.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft:0,
    listname:[
      {
        title:"群组邀请",
        id:0
      },
      {
        title:"新增任务",
        id:1
      }
    ],
    invatation:[
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
        groupName:"Group7"
      }
    ],
    newtask:[
      {
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
      }
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