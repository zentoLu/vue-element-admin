import { asyncRouterMap, constantRouterMap } from '@/router'
import http from '@/utils/httpRequest'
import { isURL } from '@/utils/validate'
/* Layout */
import Layout from '@/views/layout/Layout'
import Empty from '@/views/layout/components/Empty'
import IframeUrl from '@/views/layout/components/IframeUrl'
// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('@/router/import-' + process.env.NODE_ENV)

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType(route) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 * @param {*} layer  路由层数
 */
function fnAddDynamicMenuRoutes(menuList = [], layer = 1) {
  var routes = []
  for (var i = 0; i < menuList.length; i++) {
    var list = menuList[i].list,
      route
    if (list && list.length >= 1) {
      //目录处理
      //处理嵌套路由
      route = {
        //path: layer !== 1 ? list[0].url.split('/')[0] : '',
        path: '',
        //redirect: list[0].url,
        component: layer === 1 ? Layout : Empty,
        alwaysShow: true,
        name: '',
        meta: {
          icon: menuList[i].icon,
          menuId: String(menuList[i].id),
          title: menuList[i].name,
          isDynamic: true,
          isTab: true
        },
        children: fnAddDynamicMenuRoutes(list, layer + 1)
      }
    } else {
      var url = menuList[i].url ? menuList[i].url.replace(/^\//, '') : '';
      route = {
        path: url.replace(/\//g, '-'),
        component: null,
        name: url.replace(/\//g, '-'),
        meta: {
          icon: menuList[i].icon,
          menuId: String(menuList[i].id),
          title: menuList[i].name,
          isDynamic: true,
          isTab: true
        }
      }

      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].id}`
        route['name'] = `i-${menuList[i].id}`
        route['meta']['iframeUrl'] = menuList[i].url
        route.component = IframeUrl
      } else {
        try {
          //let importUrl = '../../views/modules/' + url;
          (function(url) {
            //let importUrl = 'example/create';
            let importUrl = 'modules/' + url;
            route.component = _import(importUrl);
            // console.log(importUrl,route.component);
          })(url);

        } catch (e) {
          console.log(e);
        }
      }
    }
    routes.push(route)
  }
  return routes
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        /*const { roles } = data
        let accessedRouters
        if (roles.indexOf('admin') >= 0) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }*/
        http({
          url: http.adornUrl('/sys/menu/nav'),
          method: 'get',
          params: http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 200) {
            let accessedRouters = fnAddDynamicMenuRoutes(data.data.menuList)
            accessedRouters.push({ path: '*', redirect: '/404', hidden: true })
            // console.log(JSON.parse(JSON.stringify(accessedRouters)));
            commit('SET_ROUTERS', accessedRouters)
            resolve()
            sessionStorage.setItem('menuList', JSON.stringify(data.data.menuList || '[]'))
            sessionStorage.setItem('permissions', JSON.stringify(data.data.permissions || '[]'))
          } else {
            sessionStorage.setItem('menuList', '[]')
            sessionStorage.setItem('permissions', '[]')
          }
        })
      })
    }
  }
}

export default permission
