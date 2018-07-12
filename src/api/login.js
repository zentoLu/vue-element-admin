import request from '@/utils/httpRequest'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: request.adornUrl('/sys/login'),
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: request.adornUrl('/sys/logout'),
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: request.adornUrl('/sys/user/info'),
    method: 'get',
    params: { token }
  })
}

