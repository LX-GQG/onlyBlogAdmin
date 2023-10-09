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

export function getArticleComment(data) {
    return request({
        url: 'admin/articleComment',
        method: 'post',
        data
    })
}

export function addComment(data) {
    return request({
        url: 'admin/addComment',
        method: 'post',
        data
    })
}

export function delComment(data) {
    return request({
        url: 'admin/delComment',
        method: 'post',
        data
    })
}

export function updateComment(data) {
    return request({
        url: 'admin/updateComment',
        method: 'post',
        data
    })
}

export function getCommentUser(data) {
    return request({
        url: 'admin/getCommentUser',
        method: 'post',
        data
    })
}