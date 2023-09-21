import { request } from "../utils/request";

export function addAdmin(data) {
    return request({
        url: 'admin/addAdmin',
        method: 'post',
        data
    })
}

export function updateAdmin(data) {
    return request({
        url: 'admin/updateAdmin',
        method: 'post',
        data
    })
}

export function deleteAdmin(data) {
    return request({
        url: 'admin/deleteAdmin',
        method: 'post',
        data
    })
}

export function adminList(data) {
    return request({
        url: 'admin/adminList',
        method: 'post',
        data
    })
}

export function updatePassword(data) {
    return request({
        url: 'admin/updatePassword',
        method: 'post',
        data
    })
}

export function getRoleList(data) {
    return request({
        url: 'admin/getRoleList',
        method: 'post',
        data
    })
}