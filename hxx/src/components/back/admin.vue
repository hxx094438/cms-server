<template>
  <div class="wrapper">
    <div class="statusLine">
      <p class="left">
        <router-link :to="{name: 'home'}" class="iconfont icon-zhuye" tag="i"></router-link>
        <span>{{time}}好，{{name}}</span>
      </p>
      <p class="right" @click="logout">
        <i class="iconfont icon-out"></i>
        <span>登出</span>
      </p>
    </div>
    <div class="container">
      <nav>
        <ul>
          <router-link :to="{name: 'posts'}" tag="li">
            <i class="iconfont icon-biji-copy"></i>文章
          </router-link>
          <router-link :to="{name: 'search'}" tag="li">
            <i class="iconfont icon-search"></i>搜索
          </router-link>
          <router-link :to="{name: 'drafts'}" tag="li">
            <i class="iconfont icon-draft"></i>草稿
          </router-link>
          <router-link :to="{name: 'account'}" tag="li">
            <i class="iconfont icon-zhanghu"></i>账户
          </router-link>
        </ul>
      </nav>
      <transition
        mode="out-in"
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {

  computed: {
    ...mapState(['user']),
    time() {
      const hours = new Date().getHours()
      if (hours > 5 && hours < 12) {
        return '早上'
      } else if (hours > 12 && hours < 19) {
        return '下午'
      } else if (hours === 12) {
        return '中午'
      } else {
        return '晚上'
      }
    },
    name() {
      // return localStorage.userName
      return 'admin  name'
    }
  },
  methods: {
    ...mapMutations(['unset_user']),
    logout() {
      this.unset_user()
      this.$router.go({ name: 'login' })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../assets/css/icon.scss';
.wrapper {
  width: 65rem;
  margin: 0 auto;
  .statusLine {
    background: transparent;
    width: 100%;
    height: 3.125rem;
    line-height: 3.125rem;
    color: #666;
    font-size: 1.125rem;
    display: flex;
    justify-content: space-between;
    p.left {
      margin-left: 1.25rem;
      i.icon-zhuye {
        font-size: 1.875rem;
        color: #999;
        cursor: pointer;
        &:hover {
          color: #666;
        }
      }
    }
    p.right {
      cursor: pointer;
      margin-right: 1.25rem;
      color: #999;
      i.icon-out {
        font-size: 1.25rem;
      }
      &:hover {
        color: #666;
      }
    }
  }
  .container {
    display: flex;
    justify-content: space-between;
    nav {
      display: inline-block;
      position: relative;
      color: #666;
      margin-top: 10%;
      width: 15%;
      ul {
        padding-left: 0;
        list-style: none;
        li {
          width: 80%;
          height: 2.5rem;
          line-height: 2.5rem;
          text-align: center;
          cursor: pointer;
          border-left: 0.1875rem solid transparent;
          transition: 0.5s;
          &:hover {
            transition: 0.5s;
            padding-left: 1.25rem;
            color: #444;
          }
          i {
            font-size: 1.125rem;
            margin-right: 0.625rem;
          }
        }
        li.router-link-active {
          font-weight: 600;
          color: #333;
        }
      }
    }
  }
}
@media screen and (max-width: 440px) {
  .content {
    margin-left: 0 !important;
  }
  nav {
    float: none !important;
    margin-top: 1rem !important;
    width: 100% !important;
    ul {
      display: flex;
      justify-content: space-between;
      flex-wrap: nowrap;
      width: 100% !important;
      li:hover {
        padding-left: 0 !important;
      }
    }
  }
}
</style>
