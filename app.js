//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    var this_=this
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code_ = res.code //返回code
        //console.log(code_)
        //console.log(code);
        var appid = "wxf3e65585a89d7dca"        
          var secret = "fb11d271f44fd5ac97eb031d492faed0"    
          var openid = ""
          var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + res.code + '&grant_type=authorization_code'
          wx.request({
            url: l,
            data: {},
            method: 'GET', 
            success: function (res) {
              this_.globalData.openID=res.data.openid
              //console.log("取得的openid==" + res.data.openid)
              // 获取用户信息
              wx.getSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                      success: res => {
                      // 可以将 res 发送给后台解码出 unionId
                      this_.globalData.userInfo = res.userInfo
                      //console.log(res)
                      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                      // 所以此处加入 callback 以防止这种情况
                      //console.log(this_.globalData.userInfo.nickName)
                      wx.request({
                        url: this_.globalData.server+'/user/login',
                        data:{      
                          userName:this_.globalData.userInfo.nickName,       
                          openID:this_.globalData.openID
                        },
                        method:"POST",
                        header: {
                          'content-type': 'application/x-www-form-urlencoded'
                        },
                        success(res){
                          //this_.globalData.userID=res.data.userID
                          this_.globalData.userID=1
                        }
                        })
                        if (this_.userInfoReadyCallback) {
                          this_.userInfoReadyCallback(res)
                        }
                        }
                    })
                  }
                }
              })
              
            }
          });
      },
      fail: function (res) {
    
      }
      
    })
    
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this_.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this_.globalData.Custom = capsule;
        	this_.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
        	this_.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
    
  },
  globalData: {
    userInfo:'',
    openID:'',
    userID:1,
    NavCur: "index", // current navigation tab
    server:'http://39.98.75.232:5000/'
  }
})