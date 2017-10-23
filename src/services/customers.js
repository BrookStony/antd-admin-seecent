import { request, config } from 'utils'

const { api } = config
const { customers } = api

export async function query (params) {
  return request({
    url: customers,
    method: 'get',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: customers,
    method: 'delete',
    data: params,
  })
}
