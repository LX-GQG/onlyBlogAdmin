import { request } from "../utils/request";

export function addUser(data) {
    return request({
        url: 'admin/addUser',
        method: 'post',
        data
    })
}

export function updateUser(data) {
    return request({
        url: 'admin/updateUser',
        method: 'post',
        data
    })
}

export function deleteUser(data) {
    return request({
        url: 'admin/deleteUser',
        method: 'post',
        data
    })
}

export function userList(data) {
    return request({
        url: 'admin/userList',
        method: 'post',
        data
    })
}