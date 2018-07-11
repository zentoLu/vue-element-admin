<template>
  <div class="mod-card">
    <div class="card-header">
        <h1 id = "card-title-id" class="card-title" style="margin-top:1.1rem"></h1>
        <div id = "card-subtitle-id" class="card-subtitle" style="margin-top:1rem"></div>
    </div>
    <div id = "card-block-id" class="card-block">
    </div>
    <div class="card-footer">
    	<h3 class="modal-title" id="yuwen-comments"></h3>
    	<div id = "listview-id" class="listview listview--bordered">
		</div>
    </div>
  </div>
</template>

<script>
export default {
  created () {
    this.getData()
  },
  methods: {
      // 获取数据列表
    getData () {
      this.$http({
        url: this.$http.adornUrl(`/sys/one/onelist`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 200) {
          var result = JSON.parse(data.data)
          var yuwen = result.data.content_list[2]
          var itemid = yuwen.item_id
          var id = yuwen.id
          this.getYuWenDetail(itemid, id)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    getYuWenDetail (itemid, id) {
      this.$http({
        url: this.$http.adornUrl('/sys/one/info/yuwenDetail/' + itemid + '/' + id),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 200) {
          var result = JSON.parse(data.data)
          result = result.data
          document.getElementById('card-title-id').innerHTML = result.hp_title
          document.getElementById('card-subtitle-id').innerHTML = '<span>' + result.maketime + '&nbsp;&nbsp;' + result.hp_author + '</span>'
          document.getElementById('card-block-id').innerHTML = result.hp_content
          var span = document.createElement('span')
          span.innerHTML = '<span style="font-weight: 600">' + result.hp_author_introduce + '&nbsp;&nbsp;最后编辑时间：' + result.last_update_date + '</span>'
          document.getElementById('card-block-id').appendChild(span)
          document.getElementById('yuwen-comments').innerHTML = '网友评论：'
          this.getYuWenComments(itemid)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    getYuWenComments (itemid) {
      this.$http({
        url: this.$http.adornUrl('/sys/one/info/yuwenComments/' + itemid),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 200) {
          var result = JSON.parse(data.data)
          result = result.data.data
          var commentshtml = ''
          for (var ij = result.length - 1; ij >= 0; ij--) {
            if (!result[ij].quote.length) {
              commentshtml += '<div class="listview__item" id="' + result[ij].user.user_id + '">'
              commentshtml += '<label class="custom-control custom-control--char todo__item">'
              commentshtml += '<span class="custom-control-char"><img src="' + result[ij].user.web_url + '"/></span>'
              commentshtml += '<div class="todo__info">'
              commentshtml += '<span style="display:inline-block">' + result[ij].user.user_name + '</span>&nbsp;&nbsp;'
              commentshtml += '<small style="display:inline-block">' + result[ij].input_date + '</small>'
              commentshtml += '</div><div class="comments__info" style="padding: 6px 0">'
              commentshtml += '<span>' + result[ij].content + '</span></div></label></div>'
            }
          }
          var spancommentshtml = document.createElement('span')
          spancommentshtml.innerHTML = commentshtml
          document.getElementById('listview-id').appendChild(spancommentshtml)
          for (var ii = result.length - 1; ii >= 0; ii--) {
            if (result[ii].quote.length) {
              var replayid = result[ii].touser.user_id
              var replayhtml = ''
              replayhtml += '<div class="listview__item">'
              replayhtml += '<label class="custom-control custom-control--char todo__item">'
              replayhtml += '<div class="todo__info">'
              replayhtml += '<span style="display:inline-block">' + result[ii].user.user_name + '</span>&nbsp;&nbsp;'
              replayhtml += '<small style="display:inline-block">' + result[ii].input_date + '</small>'
              replayhtml += '</div><div class="comments__info" style="padding: 6px 0">'
              replayhtml += '<span>' + result[ii].content + '</span></div>'
              replayhtml += '<span class="custom-control-char"><img src="' + result[ii].user.web_url + '"/></span>'
              replayhtml += '</label></div>'
              var spanreplayhtml = document.createElement('span')
              spanreplayhtml.innerHTML = replayhtml
              if (document.getElementById(replayid)) {
                document.getElementById(replayid).appendChild(spanreplayhtml)
              }
            }
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  }
}
</script>
<style>
.custom-control-char { position: absolute; font-style: normal; width: 3rem; height: 3rem; border-radius: 50%; left: 0; top: 0; }
.custom-control-char img { width: 3rem; height: 3rem; border-radius: 2px; }
.todo__info { display: inline; }
.todo__item small { margin-top: 0; }
.card-block p { line-height: 1.95rem; font-size: 1.1rem; }
#yuwen-comments { font-size: 1.2rem; margin-top: -1rem; padding-bottom: .8rem; }
.card-sub-block { font-size: 1.1rem; font-weight: 600; }
</style>
