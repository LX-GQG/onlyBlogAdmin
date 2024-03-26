import { request } from "../utils/request";

export function lotteryList(data) {
    return request({
        url: 'admin/lotteryList',
        method: 'post',
        data
    })
}