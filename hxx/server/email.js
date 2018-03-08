//教程 `https://segmentfault.com/a/1190000010291860`
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    secureConnection: true, // use SSL
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'hxx094438@163.com',
        pass: '330109986' //如果是QQ邮箱需要使用授权码
    }
})
exports.send = function(to, subject, html, res) {
    const mailOptions = {
        from: '"hxx博客客服小美👻" <hxx094438@163.com>',
        to : to,
        subject : subject + 'Hello ✔',
        html : html
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error)
            res.status(504).end("通知邮件发送失败")
        } else {
            console.log("Message sent: " + info.response)
        }
    })
}