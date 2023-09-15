import { request } from "../utils/request";

export function addTag(data) {
    return request({
        url: 'admin/addTag',
        method: 'post',
        data
    })
}

export function updateTag(data) {
    return request({
        url: 'admin/updateTag',
        method: 'post',
        data
    })
}

export function deleteTag(data) {
    return request({
        url: 'admin/deleteTag',
        method: 'post',
        data
    })
}

export function tagList(data) {
    return request({
        url: 'admin/tagList',
        method: 'post',
        data
    })
}