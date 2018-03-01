const login = require('./login')
const article = require('./article')
const draft = require('./draft.js')
const tag = require('./tag.js')


module.exports = (app) => {
    app.use(login)
    app.use(article)
    app.use(draft)
    app.use(tag)
}
