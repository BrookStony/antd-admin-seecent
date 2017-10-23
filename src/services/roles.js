import { request, config } from 'utils'

const { api } = config
const { roles } = api

export async function query (params) {
  return request({
    url: roles,
    method: 'get',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: roles,
    method: 'delete',
    data: params,
  })
}
