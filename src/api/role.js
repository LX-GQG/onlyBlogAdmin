import { request } from "../utils/request";

export function roleList(data) {
    return request({
        url: 'api/roleList',
        method: 'post',
        data
    })
}

export function updateRole(data) {
    return request({
        url: 'api/updateRole',
        method: 'post',
        data
    })
}

export function deleteRole(data) {
    return request({
        url: 'api/deleteRole',
        method: 'post',
        data
    })
}

export function addRole(data) {
    return request({
        url: 'api/addRole',
        method: 'post',
        data
    })
}

export function permissionList(data) {
    return request({
        url: 'api/permissionList',
        method: 'post',
        data
    })
}

export function assignPermission(data) {
    return request({
        url: 'api/assignPermission',
        method: 'post',
        data
    })
}