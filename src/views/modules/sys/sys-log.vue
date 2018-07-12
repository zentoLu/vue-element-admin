<template>
<el-dialog
    title="实时日志"
    :close-on-click-modal="false"
    :visible.sync="syslogVisible">
  <div class="mod-log">
    <el-form :inline="true">
      <el-form-item>
        <el-button @click="openSocket()">开启日志</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="closeSocket()">关闭日志</el-button>
      </el-form-item>
    </el-form>
    <div id="log-container" style="overflow-y:auto; overflow-x:auto;width:inherit;height:400px;background: #102310; color: #aaa; padding: 10px;">
			<div id="log-container-div"></div>
		</div>
  </div>
  <span slot="footer" class="dialog-footer">
      <el-button @click="syslogVisible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import VueCookie from 'vue-cookie'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
Vue.use(VueCookie)
export default {
  data () {
    return {
      client: null,
      syslogVisible: false
    }
  },
  methods: {
    init () {
      this.syslogVisible = true
    },
    closeSocket () {
      if (this.client !== null) {
        this.client.disconnect()
        this.client = null
      }
    },
    openSocket () {
      if (this.client == null) {
        var socket = new SockJS('http://127.0.0.1/websocket/tracker')
        let stompClient = Stomp.over(socket)
        stompClient.connect({
          token: Vue.cookie.get('token')
        }, function (frame) {
          console.log('fix' + stompClient)
          stompClient.send('/topic/welcome', {}, JSON.stringify({
            'token': Vue.cookie.get('token')
          }))
          stompClient.subscribe('/topic/logs', function (event) {
            var content = JSON.parse(event.body)
            var p = document.createElement('p')
            p.innerHTML = content.msg
            document.getElementById('log-container-div').appendChild(p)
            var br = document.createElement('br')
            document.getElementById('log-container-div').appendChild(br)
          }, {
            token: Vue.cookie.get('token')
          })
        })
        this.client = stompClient
      }
    }
  }
}
</script>
