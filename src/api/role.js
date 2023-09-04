import { request } from "../utils/request";

export function roleList(data) {
    return request({
        url: 'admin/roleList',
        method: 'post',
        data
    })
}

export function updateRole(data) {
    return request({
        url: 'admin/updateRole',
        method: 'post',
        data
    })
}

export function deleteRole(data) {
    return request({
        url: 'admin/deleteRole',
        method: 'post',
        data
    })
}

export function addRole(data) {
    return request({
        url: 'admin/addRole',
        method: 'post',
        data
    })
}

export function permissionList(data) {
    return request({
        url: 'admin/permissionList',
        method: 'post',
        data
    })
}

export function assignPermission(data) {
    return request({
        url: 'admin/assignPermission',
        method: 'post',
        data
    })
}