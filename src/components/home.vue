<template>
<el-container class = "home-continer">
  <el-header>
    <div><img src="../assets/logo.png" alt=""><span>后台管理系统</span></div>
    <el-button @click = "signOut()">退出</el-button>
  </el-header>
  <el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-main>Main</el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    signOut() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped>
.home-continer{
  height:100%;
}
.el-header{
  background: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color:white;
  font-size:20px;
  > div{
    display: flex;
    align-items: center;
    span{
      margin-left:15px;
    }
    img{
      width: 30px;
    }
  }
}
.el-aside{
  background:#333744;
}
.el-main{
  background:#787b88
}
</style>
