<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-steps :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-position="top"
        label-width="80px"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input> </el-form-item
            ><el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addForm.goods_price"
                type="number"
              ></el-input> </el-form-item
            ><el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addForm.goods_weight"
              ></el-input> </el-form-item
            ><el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addForm.goods_number"
              ></el-input> </el-form-item
            ><el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                :options="cateList"
                :props="cateProps"
                v-model="addForm.goods_cat"
                @change="handleChange"
              >
              </el-cascader> </el-form-item
          ></el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 表示图片要上传到的后台地址 -->
            <el-upload
              :action="upLoadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerobj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 富文本编辑器组件 -->
          <el-tab-pane label="商品内容" name="4"
            ><quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="add"
              >添加商品</el-button
            ></el-tab-pane
          >
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'

export default {
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        pics: [],
        // 商品的详情描述
        goods_introduce: '',
        attrs: []
      },
      upLoadURL: 'http://www.ysqorz.top:8888/api/private/v1/upload',
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur'
          }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: 'blur'
          }
        ],
        goods_cat: [
          {
            required: true,
            message: '请输入商品分类',
            trigger: 'blur'
          }
        ]
      },
      cateList: [],
      manyTableData: [],
      onlyTableData: [],
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 图片上传组件headers请求头
      headerobj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewVisible: false,
      previewPath: ''
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    // 获取所有商品分页数据
    async getCateList() {
      console.log(window.sessionStorage.getItem('token'))
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败!')
      }
      this.cateList = res.data
      console.log(this.cateList)
    },
    // 级联选择器选中项变化, 会触发这个函数
    handleChange() {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave(activeName, oldactiveName) {
      if (this.addForm.goods_cat.length !== 3 && oldactiveName === '0') {
        this.$message.error('请选择商品分类!')
        return false
      }
    },
    async tabClicked() {
      // 动态参数面板
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败!')
        }
        this.manyTableData = res.data
        console.log(this.manyTableData)
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
          console.log(item.attr_vals)
        })
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态参数列表失败!')
        }
        this.onlyTableData = res.data
        console.log(res.data)
      }
    },
    // 预览图片操作
    handlePreview(file) {
      console.log(file)
      this.previewPath =
        'http://www.ysqorz.top:8888/' + file.response.data.tmp_path
      this.previewVisible = true
    },
    // 移除图片操作
    handleRemove(file) {
      // 获取将要删除的图片的临时路径
      // 从pics 数组中 找到这个图片对应的索引值
      // 调用数组的splice方法,把图片信息对象,从pics数组中移除
      const filePath = file.response.data.temp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm.pics)
    },
    handleSuccess(response) {
      console.log(response)
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项! ')
        // 执行添加的业务逻辑
        // lodash cloneDeep(obj)
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          console.log(item)
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态参数
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败!')
        }
        this.$message.success('添加商品成功! ')
        this.$router.push('/goods')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.previewImg {
  width: 100%;
  height: 600px;
}
.btnAdd {
  margin-top: 15px;
}
</style>
