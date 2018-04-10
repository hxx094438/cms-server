<template>
    <div>
        <a href="https://segmentfault.com" class="iconfont icon-iconsf"></a>
        <a class="iconfont icon-github" href="https://github.com/hxx094438"></a>
        <a href="http://www.facebook.com" class="iconfont icon-cion15"></a>
        <p>湘ICP备17018968号</p>
        <p>Copyright © Hxx | <router-link :to="{name: 'login'}" tag="span" class="login">admin</router-link></p>
    </div>
</template>

<script>
export default {}

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .iconfont {
       font-size: 1.875rem;
       color: #333;
       margin-right: 0.625rem;
    }
    .icon-github:hover {
             color: royalblue;
    }
    .icon-cion15 {
        font-size: 1.625rem;
    }
    .icon-cion15:hover {
        color: deepskyblue;
    }
    .icon-iconsf:hover {
        color: green;
    }
    div {
        text-align: center;
        padding-top: 1.625rem;
        border-top: 1px solid #eee;
        line-height: 1.6rem;
        width: 50rem;
        margin: 3rem auto 0;
    }
    p {
        text-align: center;
        color: #333;
        font-size: .8rem;
    }
    span.login {
        cursor: pointer;
        color: #333;
    }
</style>
