import { request } from "../utils/request";

export function addArticle(data) {
    return request({
        url: 'api/addArticle',
        method: 'post',
        data
    })
}

export function updateArticle(data) {
    return request({
        url: 'api/updateArticle',
        method: 'post',
        data
    })
}

export function deleteArticle(data) {
    return request({
        url: 'api/deleteArticle',
        method: 'post',
        data
    })
}

export function articleList(data) {
    return request({
        url: 'api/articleList',
        method: 'post',
        data
    })
}