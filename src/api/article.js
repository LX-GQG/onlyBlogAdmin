import { request } from "../utils/request";

export function addArticle(data) {
    return request({
        url: 'admin/addArticle',
        method: 'post',
        data
    })
}

export function updateArticle(data) {
    return request({
        url: 'admin/updateArticle',
        method: 'post',
        data
    })
}

export function deleteArticle(data) {
    return request({
        url: 'admin/deleteArticle',
        method: 'post',
        data
    })
}

export function articleList(data) {
    return request({
        url: 'admin/articleList',
        method: 'post',
        data
    })
}

export function getArticleTag(data) {
    return request({
        url: 'admin/getArticleTag',
        method: 'post',
        data
    })
}