import { request, config } from 'utils'

const { api } = config
const { customer } = api

export async function query (params) {
  return request({
    url: customer,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: customer.replace('/:id', ''),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: customer,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: customer,
    method: 'patch',
    data: params,
  })
}
