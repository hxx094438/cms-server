const express = require('express')
const router = express.Router()
const db = require('../db/db.js')
const confirmToken = require('../middlewares/confirmToken')

// 发布文章
router.post('/api/article', confirmToken, (req, res) => {
    const article = {
        comment_n: 0,
        title: req.body.title,
        content: req.body.content,
        date: Date(),
        tags: req.body.tags,
        isPublish: true,
        ArticleLike: 0
    }
    new db.Article(article).save()
    res.status(200).send('succeed in saving new passage.')
})

// 获取某篇文章
router.get('/api/article/:aid', (req, res) => {
    db.Article.findOne({aid: req.params.aid}, (err, doc) => {
        if (err) {
            console.log(err)
        } else {
            res.status(200).send(doc)
        }
    })
})

// 删除文章并删除文章下面的评论
router.delete('/api/article/:aid', confirmToken, (req, res) => {
    db.Article.remove({aid: req.params.aid}, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            db.Comment.remove({articleId: req.params.aid}, (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    res.status(200).send('succeed in deleting ---' + data)
                }
            })
        }
    })
})

// 更新文章
router.patch('/api/article/:aid', confirmToken, (req, res) => {
    const aid = req.params.aid
    const article = {
        title: req.body.title,
        tags: req.body.tags,
        date: Date(),
        content: req.body.content,
        isPublish: true
    }
    db.Article.update({aid: aid}, article, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            res.status(200).send('succeed in updating ---' + data.title)
        }
    })
})

// 获取很多文章
router.get('/api/articles', (req, res) => {
    const page = req.query.payload.page;
    const value = req.query.payload.value;
    const limit = req.query.payload.limit - 0 || 4;
    const skip = limit * (page - 1);
    const article = {};
    db.Article.count({isPublish: true}).exec(function (err, count) {
        err ? console(err) : article.total = Math.ceil(count / limit)
    })
    if (value && value !== '全部') {
        db.Article.find({tags: value, isPublish: true}).sort({date: -1}).limit(limit).skip(skip).exec()
            .then((articles) => {
                article.articles = articles;
                res.send(article)
            }).catch(err => console.log(err))
    } else {
        db.Article.find({isPublish: true}).sort({date: -1}).limit(limit).skip(skip).exec()
            .then((articles) => {
                article.articles = articles;
                res.send(article)
            }).catch(err => console.log(err))
    }
})

// 搜索一些文章
router.get('/api/someArticles', (req, res) => {
    const key = req.query.payload.key
    const value = req.query.payload.value
    const page = req.query.payload.page || 1
    const limit = req.query.payload.limit - 0 || 4;
    const skip = 4 * (page - 1)
    const re = new RegExp(value, 'i')
    const search = {};
    if (value === '') {                 // 如果没有输入值则搜索全部
        db.Article.count({isPublish: true}).exec(function (err, count) {
            err ? console(err) : search.total = Math.ceil(count / limit)
        })
        db.Article.find({isPublish: true}).sort({date: -1}).limit(limit).skip(skip).exec()
            .then((articles) => {
                search.articles = articles;
                res.send(search)
            }).catch(err => console.log(err))
    } else {
        if (key === 'tags') {                                       // 根据标签来搜索文章
            const arr = value.split(' ')
            db.Article.count({tags: {$all: arr}}).exec(function (err, count) {
                err ? console(err) : search.total = Math.ceil(count / limit)
            })
            db.Article.find({tags: {$all: arr}})
                .sort({date: -1}).limit(limit).skip(skip).exec()
                .then((articles) => {
                    search.articles = articles
                    res.send(search)
                })
        } else if (key === 'title') {
            // 根据标题的部分内容来搜索文章
            db.Article.count({title: re, isPublish: true}).exec(function (err, count) {
                err ? console(err) : search.total = Math.ceil(count / limit)
            })
            db.Article.find({title: re, isPublish: true})
                .sort({date: -1}).limit(limit).skip(skip).exec()
                .then((articles) => {
                    search.articles = articles
                    res.send(search)
                })
        } else if (key === 'date') {                                // 根据日期来搜索文章
            const nextDay = value + 'T24:00:00'
            db.Article.count({date: {$gte: new Date(value), $lt: new Date(nextDay)}}).exec(function (err, count) {
                err ? console(err) : search.total = Math.ceil(count / limit)
            })
            db.Article.find({date: {$gte: new Date(value), $lt: new Date(nextDay)}})
                .sort({date: -1}).limit(limit).skip(skip).exec()
                .then((articles) => {
                    search.articles = articles
                    res.send(search)
                })
        }
    }
})

// 文章点赞

router.patch('/api/ArticleLike/:aid', (req, res) => {
    const aid = req.params.aid
    if (aid) {
        db.Article.findOneAndUpdate({aid: aid}, {$inc: {ArticleLike: 1}}, {new: true},(err, data) => { //必须设置参数{new: true}返回的才是最新数据
            if (err) {
                console.log(err)
            } else {
                res.status(200).send(data)
            }
        })
    }
})

module.exports = router
