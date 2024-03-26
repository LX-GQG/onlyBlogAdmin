import { request } from "../utils/request";

export function detectList(data) {
    return request({
        url: 'admin/detectList',
        method: 'post',
        data
    })
}

export function detectChart(data) {
    return request({
        url: 'admin/detectChart',
        method: 'post',
        data
    })
}