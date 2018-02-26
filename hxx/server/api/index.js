const article = require('./article.js')
const login = require('./login')
const tag = require('./tag.js')

module.exports = (app) => {
    app.use(article)
    app.use(login)
    app.use(tag)

}
