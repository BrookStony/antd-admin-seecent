import { request, config } from 'utils'

const { api } = config
const { categories } = api

export async function query (params) {
  return request({
    url: categories,
    method: 'get',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: categories,
    method: 'delete',
    data: params,
  })
}
