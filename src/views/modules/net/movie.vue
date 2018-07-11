<template>
  <div class="mod-movie">
    <el-row :gutter="20">
      <el-col :span="8">
          <div>&nbsp;&nbsp;</div>
      </el-col>
      <el-col :span="8">
          <el-select v-model="defaultvalue" @change="getValue" placeholder="请选择">
            <el-option
             v-for="item in options"
             :key="item.value"
             :label="item.label"
             :value="item.value">
            </el-option>
          </el-select>
      </el-col>
      <el-col :span="8">
        <div>&nbsp;&nbsp;</div>
      </el-col>
    </el-row>
    <div id = "movie-list-id" class="row groups movie-list"></div>
  </div>
</template>

<script>
import Vue from 'vue'
import {Option} from 'element-ui'
Vue.component(Option.name, Option)
export default {
  data () {
    return {
      options: [{
        value: 1,
        label: '热门电影'
      }, {
        value: 2,
        label: '即将上映'
      }],
      defaultvalue: ''
    }
  },
  methods: {
    getValue: function (value) {
      if (value === 1) {
        this.$http({
          url: this.$http.adornUrl(`/sys/movie/hot/`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 200) {
            var result = JSON.parse(data.data)
            var movielist = result.ms
            var movielisthtml = ''
            for (var i = 0; i < movielist.length; i++) {
              movielisthtml += '<div class="col-xl-3 col-lg-3 col-sm-4 col-6">'
              movielisthtml += '<div class="groups__item">'
              movielisthtml += '<li class="movie-img aspectration" data-ratio="16:9" style="background-image:url(' + movielist[i].img + ');"></li>'
              movielisthtml += '<div class="groups__info">'
              movielisthtml += '<strong>' + movielist[i].tCn + '</strong>'
              movielisthtml += '<small>' + movielist[i].movieType + '</small>'
              movielisthtml += this.getScoreHtml(movielist[i].r)
              movielisthtml += '</div>'
              movielisthtml += '<div class="dropdown-menu dropdown-menu-right" style="min-width:100px;background-color:rgba(255,255,255,.9);z-index:1;display:none;">'
              movielisthtml += '<a class="dropdown-item" onclick="getMoiveDetail(\'' + movielist[i].id + '\');" href="javascript:void(0)">查看详情</a>'
              movielisthtml += '<a class="dropdown-item" onclick="getMoiveComments(\'' + movielist[i].id + '\',\'' + movielist[i].tCn + '\');" href="javascript:void(0)">查看评论</a>'
              movielisthtml += '</div></div></div>'
            }
            document.getElementById('movie-list-id').innerHTML = movielisthtml
          } else {
            this.$message.error(data.msg)
          }
        })
      } else if (value === 2) {
        this.$http({
          url: this.$http.adornUrl(`/sys/movie/coming/`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 200) {
            var result = JSON.parse(data.data)
            var movielist = result.moviecomings
            var movielisthtml = ''
            for (var i = 0; i < movielist.length; i++) {
              movielisthtml += '<div class="col-xl-3 col-lg-3 col-sm-4 col-6">'
              movielisthtml += '<div class="groups__item">'
              movielisthtml += '<li class="movie-img aspectration" data-ratio="16:9" onclick="getMoiveDetail(\'' + movielist[i].id + '\');" style="background-image:url(' + movielist[i].image + ');"></li>'
              movielisthtml += '<div class="groups__info">'
              movielisthtml += '<strong>' + movielist[i].title + '</strong>'
              movielisthtml += '<small>' + movielist[i].type + '</small><br/>'
              movielisthtml += '<small>' + movielist[i].releaseDate + '</small>'
              movielisthtml += '<div class="dropdown-menu dropdown-menu-right movie-action" style="min-width:100px;background-color:rgba(255,255,255,.9);z-index:1">'
              movielisthtml += '<a class="dropdown-item" onclick="getMoiveDetail(\'' + movielist[i].id + '\');" href="javascript:void(0)">查看详情</a>'
              movielisthtml += '<a class="dropdown-item" onclick="getMoiveComments(\'' + movielist[i].id + '\',\'' + movielist[i].title + '\');" href="javascript:void(0)">查看评论</a>'
            }
            document.getElementById('movie-list-id').innerHTML = movielisthtml
          } else {
            this.$message.error(data.msg)
          }
        })
      } else {
        this.$message.error('请选择')
      }
    },
    getScoreHtml (score) {
      var html = ''
      if (score >= 9) {
        html = '<div class="widget-ratings__star">' +
            '<i class="el-icon-star-on"></i>' +
            '<i class="el-icon-star-on"></i>' +
            '<i class="el-icon-star-on"></i>' +
            '<i class="el-icon-star-on"></i>' +
            '<i class="el-icon-star-on"></i>&nbsp;' + score + '</div>'
      } else if (score >= 8) {
        html = '<div class="widget-ratings__star">' +
            '<i class="el-icon-star-on"></i>' +
            '<i class="el-icon-star-on"></i>' +
            '<i class="el-icon-star-on"></i>' +
            '<i class="el-icon-star-on"></i>' +
            '<i class="el-icon-star-off"></i>&nbsp;' + score + '</div>'
      } else if (score >= 6) {
        html = '<div class="widget-ratings__star">' +
            '<i class="el-icon-star-on"></i>' +
            '<i class="el-icon-star-on"></i>' +
            '<i class="el-icon-star-on"></i>' +
            '<i class="el-icon-star-off"></i>' +
            '<i class="el-icon-star-off"></i>&nbsp;' + score + '</div>'
      } else if (score >= 4) {
        html = '<div class="widget-ratings__star">' +
            '<i class="el-icon-star-on"></i>' +
            '<i class="el-icon-star-on"></i>' +
            '<i class="el-icon-star-off"></i>' +
            '<i class="el-icon-star-off"></i>' +
            '<i class="el-icon-star-off"></i>&nbsp;' + score + '</div>'
      } else if (score >= 2) {
        html = '<div class="widget-ratings__star">' +
            '<i class="el-icon-star-on"></i>' +
            '<i class="el-icon-star-off"></i>' +
            '<i class="el-icon-star-off"></i>' +
            '<i class="el-icon-star-off"></i>' +
            '<i class="el-icon-star-off"></i>&nbsp;' + score + '</div>'
      } else {
        html = '<div class="widget-ratings__star">' +
            '<i class="el-icon-star-off"></i>' +
            '<i class="el-icon-star-off"></i>' +
            '<i class="el-icon-star-off"></i>' +
            '<i class="el-icon-star-off"></i>' +
            '<i class="el-icon-star-off"></i>&nbsp;<span style="font-size:1rem">暂无评分</span></div>'
      }
      return html
    }
  }
}
</script>
<style>
.movie-img { background-size: cover; background-repeat: no-repeat; background-clip: padding-box; list-style: none; }
.aspectration { position: relative; height: 0; width: 100%; }
.aspectration[data-ratio="16:9"] { padding-top: 145%; }
.col-xl-3 { flex: 0 0 25%; max-width: 20% !important; }
.movie-action a:hover { background-color: rgba(255, 255, 255, 0.2) }
</style>
