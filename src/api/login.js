import { request } from "../utils/request";

export function login(data) {
    return request({
        url: 'admin/login',
        headers: {
            isToken: false
        },
        method: 'post',
        data
    })
}

export function getMenu(data) {
    return request({
        url: 'admin/getMenu',
        method: 'post',
        data
    })
}