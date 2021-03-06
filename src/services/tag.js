import { request, config } from 'utils'

const { api } = config
const { tag } = api

export async function query (params) {
  return request({
    url: tag,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: tag.replace('/:id', ''),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: tag,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: tag,
    method: 'patch',
    data: params,
  })
}
