<template>
  <div class="mod-weather">
    <el-row :gutter="20">
      <el-col :span="8">
          <div>&nbsp;&nbsp;</div>
      </el-col>
      <el-col :span="8">
          <el-autocomplete  
            v-model="city"   
            :fetch-suggestions="querySearchAsync"   
            @select="handleSelect"  
            placeholder="请输入城市名称">  
          </el-autocomplete> 
      </el-col>
      <el-col :span="8">
        <div>&nbsp;&nbsp;</div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="12">
            <div id="container1"></div>
        </el-col>
        <el-col :span="12">
            <div id="container2"></div>
        </el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="12">
            <div id="container3"></div>
        </el-col>
        <el-col :span="12">
            <div id="container4"></div>
        </el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="12">
            <div id="container5"></div>
        </el-col>
        <el-col :span="12">
            <div id="container6"></div>
        </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue'
import Highcharts from 'highcharts'
import {Button, Select, Input, Autocomplete} from 'element-ui'
Vue.component(Button.name, Button)
Vue.component(Select.name, Select)
Vue.component(Input.name, Input)
Vue.component(Autocomplete.name, Autocomplete)
var citys = require('@/assets/file/citys.json')//加载本地数据文件
export default {
  data () {
    return {
      areaid: '',
      city: ''
    }
  },
  methods: {
    querySearchAsync (queryString, callback) {
      // 在这里为这个数组中每一个对象加一个value字段, 因为autocomplete只识别value字段并在下拉列中显示
      let results = []
      for (let i of citys) {
        if (i['countyname'].indexOf(queryString) !== -1) {
          results.push({
            value: i['countyname'],
            areaid: i['areaid']
          })
        }
      }
      callback(results)
    },
    handleSelect (item) {
      this.areaid = item['areaid']
      if (this.areaid) {
        this.$http({
          url: this.$http.adornUrl(`/sys/weather/info/${this.areaid}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 200) {
            var result = JSON.parse(data.data)
            if (result.code === '200') {
              var countyName = result.value[0].city
              var weathers = result.value[0].weathers
              var dayc = []
              var nightc = []
              var dateArr = []
              for (var i = 0; i < weathers.length; i++) {
                if (i === weathers.length - 1) {
                  dayc.unshift(parseFloat(weathers[i].temp_day_c))
                  nightc.unshift(parseFloat(weathers[i].temp_night_c))
                  dateArr.unshift(weathers[i].date.split('-')[1] + '-' + weathers[i].date.split('-')[2])
                } else {
                  dayc.push(parseFloat(weathers[i].temp_day_c))
                  nightc.push(parseFloat(weathers[i].temp_night_c))
                  dateArr.push(weathers[i].date.split('-')[1] + '-' + weathers[i].date.split('-')[2])
                }
              }
              var weather3HoursDetailsInfos = result.value[0].weatherDetailsInfo.weather3HoursDetailsInfos
              var timeArr = []
              var hoursc = []
              for (var ii = 0; ii < weather3HoursDetailsInfos.length; ii++) {
                var time = weather3HoursDetailsInfos[ii].endTime.split(' ')[1].split(':')
                hoursc.push(parseFloat(weather3HoursDetailsInfos[ii].highestTemperature))
                timeArr.push(time[0] + ':' + time[1])
              }
              Highcharts.chart('container1', {
                chart: {
                  type: 'line'
                },
                title: {
                  text: countyName + '七天气温图',
                  style: {
                    'font-size': '1.1rem',
                    'color': '#888'
                  }
                },
                xAxis: {
                  categories: dateArr
                },
                yAxis: {
                  title: {
                    text: '°C',
                    align: 'high',
                    rotation: 0
                  }
                },
                exporting: {
                  enabled: false
                },
                plotOptions: {
                  spline: {
                    dataLabels: {
                      enabled: true
                    },
                    enableMouseTracking: true
                  }
                },
                credits: {
                  enabled: false
                },
                series: [{
                  type: 'spline',
                  color: '#FFC77F',
                  name: '高温',
                  data: dayc
                }, {
                  type: 'spline',
                  color: '#C5F0A4',
                  name: '低温',
                  data: nightc
                }]
              })

              Highcharts.chart('container2', {
                chart: {
                  type: 'line'
                },
                title: {
                  text: countyName + '未来气温细节',
                  style: {
                    'font-size': '1.1rem',
                    'color': '#888'
                  }
                },
                xAxis: {
                  categories: timeArr
                },
                yAxis: {
                  title: {
                    text: '°C',
                    align: 'high',
                    rotation: 0
                  }
                },
                exporting: {
                  enabled: false
                },
                plotOptions: {
                  spline: {
                    dataLabels: {
                      enabled: true
                    },
                    enableMouseTracking: true
                  }
                },
                credits: {
                  enabled: false
                },
                series: [{
                  type: 'spline',
                  color: '#A1D9FF',
                  name: '气温',
                  data: hoursc
                }]
              })

              var realtime = result.value[0].realtime
              var detailHtml = '<div class="card-header">' +
                        '<h2 class="card-title">当前天气</h2>' +
                        '</div>' +
                        '<div class="card-block">' +
                        '<ul class="icon-list">' +
                        '<li>天气：' + realtime.weather + '</li>' +
                        '<li>风向：' + realtime.wd + '</li>' +
                        '<li>风力大小：' + realtime.ws + '</li>' +
                        '<li>温度：' + realtime.temp + '℃</li>' +
                        '<li>体感温度：' + realtime.sendibleTemp + '℃</li>' +
                        '<li>空气湿度百分比：' + realtime.sd + '%</li>' +
                        '<li>更新时间：' + realtime.time + '</li>' +
                        '</ul>' +
                        '</div>'
              document.getElementById('container3').innerHTML = detailHtml

              var weathersHtml = '<div class="card-header">' +
                        '<h2 class="card-title">未来天气</h2>' +
                        '</div>' +
                        '<div class="card-block">' +
                        '<ul class="icon-list">' +
                        '<li style="width:100%">' + weathers[6].date + '【' + weathers[6].week + '】：日出时间---' + weathers[6].sun_rise_time + '      日落时间---' + weathers[6].sun_down_time + '      天气---' + weathers[6].weather + ' </li>' +
                        '<li style="width:100%">' + weathers[0].date + '【' + weathers[0].week + '】：日出时间---' + weathers[0].sun_rise_time + '      日落时间---' + weathers[0].sun_down_time + '      天气---' + weathers[0].weather + ' </li>' +
                        '<li style="width:100%">' + weathers[1].date + '【' + weathers[1].week + '】：日出时间---' + weathers[1].sun_rise_time + '      日落时间---' + weathers[1].sun_down_time + '      天气---' + weathers[1].weather + ' </li>' +
                        '<li style="width:100%">' + weathers[2].date + '【' + weathers[2].week + '】：日出时间---' + weathers[2].sun_rise_time + '      日落时间---' + weathers[2].sun_down_time + '      天气---' + weathers[2].weather + ' </li>' +
                        '<li style="width:100%">' + weathers[3].date + '【' + weathers[3].week + '】：日出时间---' + weathers[3].sun_rise_time + '      日落时间---' + weathers[3].sun_down_time + '      天气---' + weathers[3].weather + ' </li>' +
                        '<li style="width:100%">' + weathers[4].date + '【' + weathers[4].week + '】：日出时间---' + weathers[4].sun_rise_time + '      日落时间---' + weathers[4].sun_down_time + '      天气---' + weathers[4].weather + ' </li>' +
                        '<li style="width:100%">' + weathers[5].date + '【' + weathers[5].week + '】：日出时间---' + weathers[5].sun_rise_time + '      日落时间---' + weathers[5].sun_down_time + '      天气---' + weathers[5].weather + ' </li>' +
                        '</ul>' +
                        '</div>'
              document.getElementById('container4').innerHTML = weathersHtml

              var indexes = result.value[0].indexes
              var indexesHtml = '<div class="card-header">' +
                        '<h2 class="card-title">生活指数</h2>' +
                        '</div>' +
                        '<div class="card-block">' +
                        '<ul class="icon-list">' +
                        '<li style="width:100%">化妆指数：' + indexes[0].content + '</li>' +
                        '<li style="width:100%">感冒指数：' + indexes[1].content + '</li>' +
                        '<li style="width:100%">洗车指数：' + indexes[2].content + '</li>' +
                        '<li style="width:100%">穿衣指数：' + indexes[3].content + '</li>' +
                        '<li style="width:100%">运动指数：' + indexes[5].content + '</li>' +
                        '<li style="width:100%">紫外线强度指数：' + indexes[4].content + '</li>' +
                        '</ul>' +
                        '</div>'
              document.getElementById('container5').innerHTML = indexesHtml

              var alarms = result.value[0].alarms
              document.getElementById('container6').innerHTML = ''
              if (alarms.length) {
                alarms = alarms[0]
                var alarmsHtml = '<div class="card-header">' +
                            '<h2 class="card-title">预警信息</h2>' +
                            '</div>' +
                            '<div class="card-block">' +
                            '<ul class="icon-list">' +
                            '<li style="width:100%">预警标题：' + alarms.alarmDesc + '</li>' +
                            '<li style="width:100%">预警类型：' + alarms.alarmTypeDesc + '</li>' +
                            '<li style="width:100%">发布时间：' + alarms.publishTime + '</li>' +
                            '<li style="width:100%">预防措施：' + alarms.precaution + '</li>' +
                            '<li style="width:100%">预警详情：' + alarms.alarmContent + '</li>' +
                            '</ul>' +
                            '</div>'
                document.getElementById('container6').innerHTML = alarmsHtml
              }
            } else {
              this.$message.error(result.message)
            }
          } else {
            this.$message.error(data.msg)
          }
        })
      } else {
        this.$message.error('请输入城市！')
      }
    },
      // 获取数据列表
    getData (date) {
      this.queryDate = date || 0
      this.$http({
        url: this.$http.adornUrl(`/sys/article/info/${this.queryDate}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 200) {
          var result = JSON.parse(data.data)
          document.getElementById('card-title-id').innerHTML = result.data.title
          this.currDate = result.data.date.curr
          var newDate = this.currDate.substr(0, 4) + '-' + this.currDate.substr(4, 2) + '-' + this.currDate.substr(6, 2)
          document.getElementById('card-subtitle-id').innerHTML = '<span>' + newDate + '&nbsp;&nbsp;' + result.data.author + '</span>' + '&nbsp;&nbsp;字数 ' + result.data.wc + '</span>'
          document.getElementById('card-content-id').innerHTML = result.data.content
          this.prevDate = result.data.date.prev
          this.nextDate = result.data.date.next
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    next () {
      if (this.nextDate > this.currDate) {
        this.$message.error('明天还未到来，请耐心等待吧~')
        return
      }
      this.getData(this.nextDate)
    },
    prev () {
      this.getData(this.prevDate)
    }
  }
}
</script>