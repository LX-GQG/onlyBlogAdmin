import { request } from "../utils/request";

export function addUser(data) {
    return request({
        url: 'api/addUser',
        method: 'post',
        data
    })
}

export function updateUser(data) {
    return request({
        url: 'api/updateUser',
        method: 'post',
        data
    })
}

export function deleteUser(data) {
    return request({
        url: 'api/deleteUser',
        method: 'post',
        data
    })
}

export function userList(data) {
    return request({
        url: 'api/userList',
        method: 'post',
        data
    })
}