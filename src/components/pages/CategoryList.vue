<template>

    <div>
        <div class="navbar-div">
            <van-nav-bar title="类别列表"></van-nav-bar>
        </div>
        <van-row>
            <van-col span="6">
                 <div id="leftNav">
                     <ul>
                         <li @click="clickCategory(index,item.ID)" v-for="(item,index) in category" :class="{categoryActive:categoryIndex===index}" :key="index">
                              {{item.MALL_CATEGORY_NAME}}
                         </li>
                     </ul>
                 </div>
            </van-col>
            <van-col span="18">
                 <div class="tabCategorySub">
                     <van-tabs v-model="active" @click="onClickCategorySub">
                         <van-tab v-for="(item,index)  in categorySub" :key="index" :title="item.MALL_SUB_NAME">

                         </van-tab>
                     </van-tabs>
                 </div>
                 <div id="list-div">
                     <van-pull-refresh v-model="isRefresh" @refresh="onRefresh">

                     <!-- List 组件通过loading和finished两个变量控制加载状态，当组件滚动到底部时，会触发load事件并将loading设置成true。此时可以发起异步操作并更新数据，数据更新完毕后，
                     将loading设置成false即可。若数据已全部加载完毕，则直接将finished设置成true -->
                     <van-list
                        v-model="loading"
                        :finished="finished"
                        finished-text="没有更多了"
                        @load="onload"
                        >
                        <div class="list-item" v-for="(item,index) in goodList" :key="index" @click="goGoodsInfo(item.ID)">
                            <div class="list-item-img">
                                <img :src="item.IMAGE1" width="100%" :onerror="errorImg"/>
                            </div>
                            <div class="list-item-text">
                                <div>{{item.NAME}}</div>
                                <div>￥{{item.ORI_PRICE | moneyFilter}}</div>
                            </div>
                        </div>
                        </van-list>
                        </van-pull-refresh>
                 </div>
            </van-col>
        </van-row>
    </div>
</template>

<script>
import axios from 'axios'
import url from '@/serviceAPI.config.js'
import {toMoney} from '@/filter/moneyFilter.js'
import {Toast} from 'vant'
    export default {
        data() {
            return {
               category:[],
               categoryIndex:0,
               categorySub:[], 
               active:0,  //激活标签的值
               loading:false,//是否处于加载状态，加载过程中不触发load事件
               finished:false,//是否已加载完成，加载完成后不再触发load事件
               page:1, //商品列表的页数
               goodList:[],//商品列表信息
               categorySubId:'',//商品子类ID
               isRefresh:false ,//下拉刷新
               errorImg:'this.src="'+require('@/assets/images/errorimg.png')+'"',
            }
        },
        created(){
            this.getCategory()
        },
        filters:{
            moneyFilter(money){
                return toMoney(money)
            }
        },
        mounted(){
            //获取页面的高度
            let winHeight = document.documentElement.clientHeight
            document.getElementById('leftNav').style.height=winHeight -46 +'px'
            document.getElementById("list-div").style.height=winHeight -90-50 +'px'

        },
        methods: {
            getCategory() {
                axios({
                    url:url.getCateGoryList,
                    method:'get'
                }).then(response => {
                    if(response.data.code===200 && response.data.message){
                        this.category = response.data.message
                        this.getCategorySubByCategoryID(this.category[0].ID)
                    }
                }).catch((error)=> {
                    console.log(error)
                })
            },
            clickCategory(index,categoryId){
                this.categoryIndex = index
                this.page=1
                this.finished = false
                this.goodList= [] 
                this.getCategorySubByCategoryID(categoryId)
            },
            //根据大类读取小类类别列表
            getCategorySubByCategoryID(categoryId){
                axios({
                    url:url.getCateGorySubList,
                    method:'post',
                    data:{categoryId:categoryId}
                }).then(response => {
                    if(response.data.code===200 && response.data.message){
                        this.categorySub = response.data.message
                        this.active = 0
                        this.categorySubId = this.categorySub[0].ID
                        this.onload()
                    }
                  }
                ).catch(error => {
                    console.log(error)
                })
            },
            onClickCategorySub(index,title){
                this.categorySubId = this.categorySub[index].ID
                this.goodList = []
                this.finished = false  
                this.page = 1
                this.onload()
            },
            //上拉加载方法
            onload() {
                setTimeout(()=> {
                    this.categorySubId = this.categorySubId?this.categorySubId:this.categorySub[0].ID
                    this.getGoodList()
                },1000)
            },
            onRefresh(){
                setTimeout(()=>{
                    this.isRefresh=false;
                    this.finished = false;
                    this.goodList=[]
                    this.page=1
                    this.onLoad()
                },500)
            },
            getGoodList(){
                axios({
                    url:url.getGoodsListByCategorySubID,
                    method:'post',
                    data:{
                        categorySubId:this.categorySubId,
                        page:this.page
                    }
                }).then(response => {
                    console.log(response)
                    if(response.data.code === 200 && response.data.message.length){
                        this.page++
                        //以前数据合并起来
                        this.goodList = this.goodList.concat(response.data.message)
                    }else{
                        //数据完成，没有数据
                        this.finished = true
                    }
                    this.loading = false
                }).catch(error => {
                    console.log(error)
                })
            },
            goGoodsInfo(id){
                this.$router.push({name:'Goods',params:{goodsId:id}})
            }
        },
    }
</script>

<style scoped>
  #leftNav{
      background-color:aliceblue;
  }
  #leftNav ul li{
      line-height: 2rem;
      border-bottom:1px solid #E4E7ED;
      padding:3px;
      font-size:0.8rem;
      text-align: center;
  }
  .categoryActive{
      background-color:#ffffff;
  }
  .list-item{
      display: flex;
      flex-direction: row;
      font-size:0.8rem;
      border-bottom:1px solid #f0f0f0;
      background-color:#fff;
      padding: 5px;
  }
   #list-div{
        overflow: scroll;
    }
  .list-item-img{
      flex:8;
  }
  .list-item-text{
      flex:16;
      margin-top:10px;
      margin-left:10px;
  }
</style>