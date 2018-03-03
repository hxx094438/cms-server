const express = require('express')
const router = express.Router()
const db = require('../db/db.js')
const confirmToken = require('../middlewares/confirmToken')

//保存草稿
router.post('/api/draft',confirmToken, (req,res) => {
    const article = {
        title: req.body.title,
        content: req.body.content,
        date: Date(),
        tags: req.body.tags,
        isPublish: false
    }
    new db.Article(article).save()  //这个方法中添加了aid
    res.status(200).send('succeed in saving new draft')
})

//获取某篇草稿
// router.get('/api/draft/:aid', (req,res) => {
//     db.Article.findOne({aid: req.params.aid}, (err, doc) => {
//         if(err) {
//             console.log(err)
//         } else{
//             res.status(200).send(doc)
//         }
//     })
// })

//更新草稿
router.patch('/api/draft/:aid',confirmToken, (req, res) => {
    const aid = req.params.aid;
    const article = {
        title: req.body.title,
        content: req.body.content,
        date: Date(),
        tags: req.body.tags,
        isPublish: false
    }
    db.Article.update({aid:aid}, article , (err,data) => {
        if(err){
            console.log(err)
        }else{
            res.status(200).send('succeed in updating ---' + data.title)
        }
    })
})

//获取所有草稿
router.get('/api/drafts', (req, res) => {
    const page = req.query.payload.page
    const limit = req.query.payload.limit - 0 || 4
    const skip = limit * (page - 1 )
    db.Article.find({isPublish:false},function (err,data) {
        if(err){
            console.log(err)
        }else if(data) {
            const articles = data.sort({date: -1}).limit(limit).skip(skip)
            res.status(200).send(articles)
        }else{
            res.status(401).end()
        }
    });
    //
    //
    // db.Article.find({isPublish: false}).sort({date: -1}).limit(limit).skip(skip).exec().then((articles) => { //将查找到的数据降序，limit读取指定数量的数据，skip跳过指定的数据显示之后的数据，exec()返回pr
    //     res.send(articles)
    // }).catch((err) => {
    //     console.log(err)
    // })
})

module.exports = router