// 获取用户信息
export function login() {
  return {
    // isOpen: false,
    url: '/sys/login',
    type: 'post',
    data: {
      'code': 200,
      'msg': '操作成功',
      'data': {
        'token': '224b1fd4573429a429bec829314128a1',
        'expire': 43200
      }
    }
  }
}

// 获取用户信息
export function info() {
  return {
    // isOpen: false,
    url: '/sys/user/info',
    type: 'post',
    data: {
      'code': 200,
      'msg': '操作成功',
      'data': {
        'id': 1,
        'createdTime': '2016-11-11T11:11:11',
        'username': 'admin',
        'email': '1348200259@qq.com',
        'mobile': '13612345678',
        'status': 1,
        'roleIdList': null
      }
    }
  }
}

// 获取用户信息
export function userInfo() {
  return {
    // isOpen: false,
    url: '/sys/user/info',
    type: 'get',
    data: {
      'code': 200,
      'msg': '操作成功',
      'data': {
        'id': 1,
        'createdTime': '2016-11-11T11:11:11',
        'username': 'admin',
        'email': '1348200259@qq.com',
        'mobile': '13612345678',
        'status': 1,
        'roleIdList': null
      }
    }
  }
}

// 获取用户权限
export function nav() {
  return {
    // isOpen: false,
    url: '/sys/menu/nav',
    type: 'get',
    data: {
  "code" : 200,
  "msg" : "操作成功",
  "data" : {
    "menuList" : [ {
      "id" : 1,
      "createdTime" : null,
      "parentId" : 0,
      "parentName" : null,
      "name" : "系统管理",
      "url" : null,
      "perms" : null,
      "type" : 0,
      "icon" : "system",
      "orderNum" : 0,
      "open" : null,
      "list" : [ {
        "id" : 4,
        "createdTime" : null,
        "parentId" : 1,
        "parentName" : null,
        "name" : "菜单管理",
        "url" : "sys/menu",
        "perms" : null,
        "type" : 1,
        "icon" : "menu",
        "orderNum" : 3,
        "open" : null,
        "list" : null
      }, {
        "id" : 45,
        "createdTime" : null,
        "parentId" : 1,
        "parentName" : null,
        "name" : "网络资源",
        "url" : "",
        "perms" : null,
        "type" : 0,
        "icon" : "tubiao",
        "orderNum" : 10,
        "open" : null,
        "list" : [ {
          "id" : 46,
          "createdTime" : null,
          "parentId" : 45,
          "parentName" : null,
          "name" : "每日一文",
          "url" : "net/article",
          "perms" : null,
          "type" : 1,
          "icon" : "bianji",
          "orderNum" : 1,
          "open" : null,
          "list" : null
        }, {
          "id" : 47,
          "createdTime" : null,
          "parentId" : 45,
          "parentName" : null,
          "name" : "天气预报",
          "url" : "net/weather",
          "perms" : null,
          "type" : 1,
          "icon" : "xiangqu",
          "orderNum" : 2,
          "open" : null,
          "list" : null
        }, {
          "id" : 48,
          "createdTime" : null,
          "parentId" : 45,
          "parentName" : null,
          "name" : "ones",
          "url" : "net/one",
          "perms" : null,
          "type" : 1,
          "icon" : "config",
          "orderNum" : 3,
          "open" : null,
          "list" : null
        }, {
          "id" : 49,
          "createdTime" : null,
          "parentId" : 45,
          "parentName" : null,
          "name" : "电影",
          "url" : "net/movie",
          "perms" : null,
          "type" : 1,
          "icon" : "xiangqufill",
          "orderNum" : 4,
          "open" : null,
          "list" : null
        } ]
      }, {
        "id" : 50,
        "createdTime" : null,
        "parentId" : 1,
        "parentName" : null,
        "name" : "名单管理",
        "url" : null,
        "perms" : null,
        "type" : 0,
        "icon" : "admin",
        "orderNum" : 11,
        "open" : null,
        "list" : [ {
          "id" : 53,
          "createdTime" : null,
          "parentId" : 50,
          "parentName" : null,
          "name" : "商机管理",
          "url" : "biz/info",
          "perms" : "biz:info:list",
          "type" : 1,
          "icon" : "admin",
          "orderNum" : 0,
          "open" : null,
          "list" : null
        } ]
      } ]
    } ],
    "permissions" : [ "sys:schedule:info", "biz:info:list", "sys:menu:update", "sys:menu:delete", "sys:config:info", "sys:generator:list", "sys:dict:delete", "sys:menu:list", "sys:config:save", "sys:menu:perms", "sys:config:update", "sys:user:delete", "sys:config:list", "sys:user:update", "sys:role:list", "sys:menu:info", "sys:menu:select", "sys:schedule:save", "sys:role:select", "sys:dict:list", "sys:user:list", "sys:dict:info", "sys:menu:save", "sys:role:save", "biz:infodetail:traslate", "sys:role:info", "biz:infodetail:save", "biz:infofuplog:save", "sys:role:update", "biz:infodetail:update", "biz:infofuplog:list", "sys:user:info", "sys:schedule:list", "sys:config:delete", "sys:role:delete", "biz:infodetail:info", "sys:user:save", "sys:dict:update", "biz:infofuplog:info", "sys:log:list", "sys:oss:all", "sys:dict:save" ]
  }
}
  }
}
