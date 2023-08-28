import { request } from "../utils/request";

export function login(data) {
    return request({
        url: 'api/login',
        headers: {
            isToken: false
        },
        method: 'post',
        data
    })
}

export function getMenu(data) {
    return request({
        url: 'api/getMenu',
        method: 'post',
        data
    })
}