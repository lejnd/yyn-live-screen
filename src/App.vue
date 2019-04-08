<template>
  <div id="app">
    <div class="mask" v-if="showError" @click="hideMask">
      <div class="err-msg">
        <img class="err-pic" src="https://manager-1254950508.file.myqcloud.com/1539842136796_4tb63hnpahsw.png" alt="异常">
        <div class="err-text">{{errMsg || '精彩内容正在路上，请先休息片刻吧'}}</div>
      </div>
    </div>
    <div class="app-header">
      <div class="header-ctc">
        <div class="header-left">{{title}}</div>
        <div class="header-right">
          <span v-if="type == 'video'" class="live-icon live-icon-ic-location"></span>
          <span v-if="type == 'video'" class="location">{{city+scenic}}</span>
          <span class=""></span>
          <span class="right-item">{{date}}</span>
          <span class="timespan" v-if="type == 'live'">{{time}}</span>
          <template v-if="weather.length != 0">
            <img class="weather-icon" :src="weather.icon" alt="天气">
            <span class="right-item temperature">{{weather.temperature}}</span>            
          </template>
          <img class="logo" src="./assets/css/imgs/logo-yunnan@2x.png" alt="游云南">
          <img v-if="type == 'live'" class="tag" src="./assets/css/imgs/label-live@2x.png" alt="直播">
        </div>        
      </div>
    </div>
    <div class="app-body">
      <div class="yn-video" id="yn_video"></div>
    </div>
    <div class="app-footer">
      <div class="footer-controller">
        <a href="javascript:;" class="live-icon" :class="playIcon" @click.stop="playSwitch">
          <span class="path1"></span><span class="path2"></span>
        </a>
        <a href="javascript:;" class="live-icon" :class="soundIcon" @click.stop="soundSwitch">
          <span class="path1"></span><span class="path2"></span>
        </a>
      </div>
      <div class="footer-ctc" v-if="content">
        <wii-notice-bar icon="systemprompt" :reset="reset" loop>{{content}}</wii-notice-bar>
      </div>
    </div>
  </div>
</template>

<script>
import 'assets/js/wii_entry.js'
import fly from 'flyio'

export default {
  name: 'App',
  data(){
    return {
      id: '',
      city: '',
      content: '',
      play_url: '',
      cover_url: '',
      scenic: '',
      title: '',
      type: '',
      playStatus: 'play',
      soundStatus: 'sound',
      weather: [],
      player: null,
      timer: -1,
      date: '',
      time: '',
      showError: false,
      errMsg: '',
      reset: false,
      count: 0,
    }
  },
  mounted(){
    let that = this
    this.request()
    this.updateTime()
    setInterval(this.updateTime, 1000)
    this.startInterVal()
  },
  computed: {
    playIcon(){
      let {playStatus,type} = this
      if(!playId){
        // playStatus == 'play' ? this.startInterVal() : this.stopInterVal()
      }
      return playStatus == 'play'? 'live-icon-ic-stop': 'live-icon-ic-play'
    },
    soundIcon(){
      let {soundStatus} = this
      return soundStatus == 'sound'? 'live-icon-ic-sound': 'live-icon-ic-mute'
    }
  },
  watch: {
    playStatus(v, o) {
      this.playStatus == 'play' ? this.startInterVal() : this.stopInterVal()
    }
  },
  methods: {
    updateTime(){
      var cd = new Date()
      this.date = this.zeroPadding(cd.getFullYear(), 4) + '-' + this.zeroPadding(cd.getMonth()+1, 2) + '-' + this.zeroPadding(cd.getDate(), 2)
      this.time = this.zeroPadding(cd.getHours(), 2) + ':' + this.zeroPadding(cd.getMinutes(), 2) + ':' + this.zeroPadding(cd.getSeconds(), 2)
    },
    zeroPadding(num, digit) {
      var zero = ''
      for(var i = 0; i < digit; i++) {
          zero += '0'
      }
      return (zero + num).slice(-digit)
    },
    startInterVal(){
      this.timer = setInterval(()=>{
        // console.log(new Date())
        this.request()
      }, 5000)      
    },
    stopInterVal(){
      clearInterval(this.timer)
    },
    playSwitch(){
      let {playStatus,player} = this
      player.togglePlay()
    },
    soundSwitch(){
      let {soundStatus,player} = this
      if(soundStatus == 'sound'){
        player.volume(0)
        this.soundStatus = 'mute'
      }else{
        player.volume(0.5)
        this.soundStatus = 'sound'
      }
    },
    request(endParams){
      let that = this
      let oldId = that.id
      let oldType = that.type
      let adParams = ``
      if(playId){
        adParams = `?play_id=${playId}`
      }
      else if(playAllId){
        adParams = `?play_all_id=${playAllId}`
      }
      else{
        adParams = endParams?endParams:''
      }
      that.showError = false
      that.reset = false
      fly.get(`/live2/api/screen/detail${adParams}`)
        .then((res)=>{
          let {ret,data,msg,errorcode} = res.data
          if(ret == 0){
            let {id,city,content,play_url,cover_url,scenic,time,title,type,weather} = data
            if(oldId == id){
              // that.player.play()
              console.log(`景区id一致`)
            }else{
              console.log(`景区id不一致`)
              console.log(`原始ID:${oldId}`)
              console.log(`当前ID:${id}`)
              console.log(`当前Count:${that.count}`);
              
              // console.log(`图片:${cover_url}`)
              
              that.count++;
              that.play_url = play_url;
              that.cover_url = cover_url;

              if (that.player && that.count == 30) {
                console.log('刷新页面计数:', that.count);
                that.count = 0;
                window.location.reload()
              }

              that.initPlayer(data)
            }
          }else{
            // that.showError = true
            console.log('错误信息：', msg);
            if (errorcode == 40702) {
              that.showError = true;
              that.stopInterVal();
              that.errMsg = '当前用户没有可播放的列表'
            }
          }
        }).catch(function (error) {
          // that.showError = true
          console.log(error)
        })
    },
    initPlayer(data){
      let that = this
      let {soundStatus} = that
      let {innerWidth,innerHeight} = window
      let pW = innerWidth
      let pH = innerHeight
      if(that.player){
        that.player.destroy()
        // that.player.load(play_url)
      }
      // }else{
      that.showError = false
      that.player = new TcPlayer('yn_video', {
        "m3u8": that.play_url,
        "autoplay" : true,
        // "loop": true,
        "controls": "none",
        "width" :  innerWidth,
        "height" : innerHeight,
        "listener": function (msg) {
          if(msg.type == 'ended'){
            that.player.play()
            
            if(that.type == 'video'){
              that.request(`?id=${that.id}&type=${that.type}&is_end=1`)
            }
          }
          if(msg.type == 'play'){
            // console.log(111, msg.type);
            
            that.playStatus = 'play'
          }else if(msg.type == 'pause'){
            that.playStatus = 'pause'
          }
          if(msg.type == 'error'){
            // that.showError = true
            console.log('error');
          }
          if(msg.type == 'play' || msg.type == 'loadeddata' || msg.type == 'loadedmatadata' && msg.src.videoWidth()>0){
            // console.log('listener',msg.src, msg.src.videoWidth(), msg.src.videoHeight())
            //获取视频的宽高比，无黑边显示视频
            var vW = msg.src.videoWidth() || pW,//视频宽高
                vH = msg.src.videoHeight() || pH,
                mW = msg.src.options.width,//设置宽高
                mH = msg.src.options.height,
                dW = parseInt(msg.src.player.width), //容器宽高
                dH = parseInt(msg.src.player.height)
            if (vW && vH) {//获取到视频的宽高，设定播放器宽高比等于视频宽高比
                var ratio = vW / vH
                if(ratio>1){
                     // console.log(ratio, vW, vH, mW, mH)
                    dH = dW / ratio
                    if (dH > mH) { // 高度超出容器
                        dW *= mH / dH
                        dH = mH
                    }
                }
            }
            msg.src.owner.style.width = `${pW}px`
            msg.src.owner.style.height = `${pH}px`
            if(dH>pH){
                msg.src.el.style.width = `${pW}px`
                msg.src.el.style.height = Math.round(dH*(pW/dW)) + 'px'
            }else if(dH<pH){
              msg.src.el.style.width = Math.round(dW*(pH/dH)) + 'px'
              msg.src.el.style.height = `${pH}px`
            }
          } 
        }      
      })
      this.player.play()
      if(soundStatus == 'sound'){
        that.player.volume(0.5)
      }else{
        that.player.volume(0)
      }
      that.id = data.id
      that.city = data.city
      that.content = data.content
      that.play_url = data.play_url
      that.scenic = data.scenic
      that.title = data.title
      that.type = data.type
      that.weather = data.weather
      that.reset = true
    },
    hideMask(){
      this.showError = false
    }
  }
}
</script>

<style lang="less">
html,body{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.vcp-error-tips{
  display: none !important;
}
.mask{
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.5);
  z-index: 99;
  background: url(https://manager-1254950508.file.myqcloud.com/1539842074793_pmb4mrxhcmc6.png);
  background-size: 100% 100%;
  .err-msg{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 500/20rem;
    height: 420/20rem;
    text-align: center;
    .err-pic{
      width: 270/20rem;
      height: 300/20rem;
    }
    .err-text{
      margin-top: 80/20rem;
      font-size: 30/20rem;
      color: #fff;
    }
  }
}
#app {
  min-height: 100%;
  background: #000;
  .live-icon{
    font-size: 40/20rem;
    text-decoration: none;
    vertical-align: middle;
  }
}
.app{
  &-header{
    position: absolute;
    top: 0;
    width: 100%;
    height: 200/20rem;
    background-image: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0,0,0,.2));
    color: #fff;
    z-index: 9;
    font-size: 30/20rem;
    .header-ctc{
      padding: 30/20rem 60/20rem;
      height: 40/20rem;
      line-height: 40/20rem;
      display: flex;
    }
    .header-left{
      padding-left: 30px;
      width: 700/20rem;
      font-size: 40/20rem;
      font-weight: bold;
      white-space: nowrap;
    }
    .header-right{
      height: 40/20rem;
      line-height: 40/20rem;      
      padding-right: 30px;
      vertical-align: middle;
      flex: 1;
      text-align: right;
      .location{
        font-weight: bold;
      }
      .location:after,.timespan:after{
        content: "|";
        margin-left: 15/20rem;
        margin-right: 15/20rem;
        margin-top: 6/20rem;
        height: 24/20rem;
        overflow: hidden;
        vertical-align: middle;
        display: inline-block;
        opacity: .4;
        vertical-align: top;
      }
      img{
        vertical-align: middle;
      }
      .weather-icon{
        width: 30/20rem;
        height: 30/20rem;
        margin-bottom: 4/20rem;
        margin-right: 5/20rem;
      }
      .logo{
        margin-left: 50/20rem;
        width: 124/20rem;
        height: 36/20rem;
      }
      .tag{
        width: 66/20rem;
        height: 36/20rem;
      }
      .right-item{
        margin-right: 10px;
        &.temperature{
          font-weight: bold;
        }
      }
    }
  }
  &-body{
    flex: 1;
    width: 100%;
    height: 100%;
  }
  &-footer{
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 160/20rem;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, .2));
    z-index: 9;
    .footer-controller{
      position: absolute;
      bottom: 30/20rem;
      left: 60/20rem;
      width: 200/20rem;
      .live-icon-ic-play,.live-icon-ic-stop{
        margin-left: 60/20rem;
      }
      .live-icon-ic-sound,.live-icon-ic-mute{
        margin-left: 30/20rem;
      }
    }
    .footer-ctc{
      flex: 1;
      position: absolute;
      width: calc(100% - 10rem);
      left: 200/20rem;
      bottom: 30/20rem;
      margin-left: 60/20rem;
      font-size: 30/20rem;
      color: #fff;
      white-space:nowrap;
      box-sizing: border-box;
    }
  }
}
</style>
