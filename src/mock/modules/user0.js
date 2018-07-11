// 获取用户信息
export function login () {
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

// 获取用户权限
export function nav () {
  return {
    // isOpen: false,
    url: '/sys/menu/nav',
    type: 'get',
    data: {
      'code': 200,
      'msg': '操作成功',
      'data': {
        'menuList': [{
          'id': 1,
          'createdTime': null,
          'parentId': 0,
          'parentName': null,
          'name': '系统管理',
          'url': null,
          'perms': null,
          'type': 0,
          'icon': 'system',
          'orderNum': 0,
          'open': null,
          'list': [{
            'id': 2,
            'createdTime': null,
            'parentId': 1,
            'parentName': null,
            'name': '管理员管理',
            'url': 'sys/user',
            'perms': null,
            'type': 1,
            'icon': 'geren',
            'orderNum': 1,
            'open': null,
            'list': null
          }, {
            'id': 3,
            'createdTime': null,
            'parentId': 1,
            'parentName': null,
            'name': '角色管理',
            'url': 'sys/role',
            'perms': null,
            'type': 1,
            'icon': 'role',
            'orderNum': 2,
            'open': null,
            'list': null
          }, {
            'id': 4,
            'createdTime': null,
            'parentId': 1,
            'parentName': null,
            'name': '菜单管理',
            'url': 'sys/menu',
            'perms': null,
            'type': 1,
            'icon': 'menu',
            'orderNum': 3,
            'open': null,
            'list': null
          }, {
            'id': 5,
            'createdTime': null,
            'parentId': 1,
            'parentName': null,
            'name': 'SQL监控',
            'url': 'http://localhost/druid/sql.html',
            'perms': null,
            'type': 1,
            'icon': 'sql',
            'orderNum': 4,
            'open': null,
            'list': null
          }, {
            'id': 6,
            'createdTime': null,
            'parentId': 1,
            'parentName': null,
            'name': '定时任务',
            'url': 'job/schedule',
            'perms': null,
            'type': 1,
            'icon': 'tixing',
            'orderNum': 5,
            'open': null,
            'list': null
          }, {
            'id': 21,
            'createdTime': null,
            'parentId': 1,
            'parentName': null,
            'name': '参数管理',
            'url': 'sys/config',
            'perms': 'sys:config:list,sys:config:info,sys:config:save,sys:config:update,sys:config:delete',
            'type': 1,
            'icon': 'shezhi',
            'orderNum': 6,
            'open': null,
            'list': null
          }, {
            'id': 23,
            'createdTime': null,
            'parentId': 1,
            'parentName': null,
            'name': '文件上传',
            'url': 'oss/oss',
            'perms': 'sys:oss:all',
            'type': 1,
            'icon': 'oss',
            'orderNum': 6,
            'open': null,
            'list': null
          }, {
            'id': 24,
            'createdTime': null,
            'parentId': 1,
            'parentName': null,
            'name': '字典管理',
            'url': 'sys/dict',
            'perms': null,
            'type': 1,
            'icon': 'zhedie',
            'orderNum': 6,
            'open': null,
            'list': null
          }, {
            'id': 22,
            'createdTime': null,
            'parentId': 1,
            'parentName': null,
            'name': '系统日志',
            'url': 'sys/log',
            'perms': 'sys:log:list',
            'type': 1,
            'icon': 'log',
            'orderNum': 7,
            'open': null,
            'list': null
          }, {
            'id': 42,
            'createdTime': null,
            'parentId': 1,
            'parentName': null,
            'name': '接口管理',
            'url': 'http://localhost/swagger-ui/index.html',
            'perms': null,
            'type': 1,
            'icon': 'zonghe',
            'orderNum': 8,
            'open': null,
            'list': null
          }, {
            'id': 43,
            'createdTime': null,
            'parentId': 1,
            'parentName': null,
            'name': '代码生成器',
            'url': 'sys/generator',
            'perms': '',
            'type': 1,
            'icon': 'bianji',
            'orderNum': 9,
            'open': null,
            'list': null
          }, {
            'id': 45,
            'createdTime': null,
            'parentId': 1,
            'parentName': null,
            'name': '网络资源',
            'url': '',
            'perms': null,
            'type': 0,
            'icon': 'tubiao',
            'orderNum': 10,
            'open': null,
            'list': [{
              'id': 46,
              'createdTime': null,
              'parentId': 45,
              'parentName': null,
              'name': '每日一文',
              'url': 'net/article',
              'perms': null,
              'type': 1,
              'icon': 'bianji',
              'orderNum': 1,
              'open': null,
              'list': null
            }, {
              'id': 47,
              'createdTime': null,
              'parentId': 45,
              'parentName': null,
              'name': '天气预报',
              'url': 'net/weather',
              'perms': null,
              'type': 1,
              'icon': 'xiangqu',
              'orderNum': 2,
              'open': null,
              'list': null
            }, {
              'id': 48,
              'createdTime': null,
              'parentId': 45,
              'parentName': null,
              'name': 'ones',
              'url': 'net/one',
              'perms': null,
              'type': 1,
              'icon': 'config',
              'orderNum': 3,
              'open': null,
              'list': null
            }, {
              'id': 49,
              'createdTime': null,
              'parentId': 45,
              'parentName': null,
              'name': '电影',
              'url': 'net/movie',
              'perms': null,
              'type': 1,
              'icon': 'xiangqufill',
              'orderNum': 4,
              'open': null,
              'list': null
            }]
          }, {
            'id': 50,
            'createdTime': null,
            'parentId': 1,
            'parentName': null,
            'name': '名单管理',
            'url': null,
            'perms': null,
            'type': 0,
            'icon': 'admin',
            'orderNum': 11,
            'open': null,
            'list': [{
              'id': 53,
              'createdTime': null,
              'parentId': 50,
              'parentName': null,
              'name': '商机名单',
              'url': 'biz/info',
              'perms': null,
              'type': 1,
              'icon': 'admin',
              'orderNum': 0,
              'open': null,
              'list': null
            }]
          }, {
            'id': 52,
            'createdTime': null,
            'parentId': 1,
            'parentName': null,
            'name': '订单管理',
            'url': 'sys/order',
            'perms': null,
            'type': 1,
            'icon': 'editor',
            'orderNum': 12,
            'open': null,
            'list': null
          }]
        }],
        'permissions': ['sys:schedule:info', 'sys:menu:update', 'sys:menu:delete', 'sys:config:info', 'sys:generator:list', 'sys:dict:delete', 'sys:menu:list', 'sys:config:save', 'sys:menu:perms', 'sys:config:update', 'sys:user:delete', 'sys:config:list', 'sys:user:update', 'sys:role:list', 'sys:menu:info', 'sys:menu:select', 'sys:schedule:save', 'sys:role:select', 'sys:dict:list', 'sys:user:list', 'sys:dict:info', 'sys:menu:save', 'sys:role:save', 'sys:role:info', 'sys:role:update', 'sys:schedule:list', 'sys:user:info', 'sys:config:delete', 'sys:role:delete', 'sys:user:save', 'sys:dict:update', 'sys:log:list', 'sys:oss:all', 'sys:dict:save']
      }
    }
  }
}

// 获取用户列表
export function list () {
  return {
    // isOpen: false,
    url: '/sys/user/list',
    type: 'get',
    data: {
      'msg': 'success',
      'code': 0,
      'page': {
        'totalCount': 2,
        'pageSize': 10,
        'totalPage': 1,
        'currPage': 1,
        'list': [{
          'userId': 1,
          'username': 'admin',
          'password': '9ec9750e709431dad22365cabc5c625482e574c74adaebba7dd02f1129e4ce1d',
          'salt': 'YzcmCZNvbXocrsz9dm8e',
          'email': 'root@renren.io',
          'mobile': '13612345678',
          'status': 1,
          'roleIdList': null,
          'createUserId': 1,
          'createTime': '2016-11-11 11:11:11'
        },
        {
          'userId': 2,
          'username': 'test',
          'password': 'e477847e4d57f667c1ff1e8a7d463a31583563104270e61f589fa829ab56a8a9',
          'salt': 'FWrbqmSyS3J0jps556lt',
          'email': '11@11.com',
          'mobile': '13311111111',
          'status': 1,
          'roleIdList': null,
          'createUserId': 1,
          'createTime': '2018-03-12 11:30:15'
        }]
      }
    }
  }
}

// 获取用户信息
export function info () {
  return {
    // isOpen: false,
    url: '/sys/user/info',
    type: 'get',
    data: {
      'msg': 'success',
      'code': 0,
      'user': {
        'userId': 1,
        'username': 'admin',
        'password': '9ec9750e709431dad22365cabc5c625482e574c74adaebba7dd02f1129e4ce1d',
        'salt': 'YzcmCZNvbXocrsz9dm8e',
        'email': 'root@renren.io',
        'mobile': '13612345678',
        'status': 1,
        'roleIdList': null,
        'createUserId': 1,
        'createTime': '2016-11-11 11:11:11'
      }
    }
  }
}

// 修改密码
export function updatePassword () {
  return {
    // isOpen: false,
    url: '/sys/user/password',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}

// 添加用户
export function add () {
  return {
    // isOpen: false,
    url: '/sys/user/save',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}

// 修改用户
export function update () {
  return {
    // isOpen: false,
    url: '/sys/user/update',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}

// 删除用户
export function del () {
  return {
    // isOpen: false,
    url: '/sys/user/delete',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}
