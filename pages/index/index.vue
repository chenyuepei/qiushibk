<template>
	<view>

		<swiper-tab-head :tabBars="tabBars" :tabIndex="tabIndex" @tabtap="tabtap">
		</swiper-tab-head>

		<view class="uni-tab-bar">
			<swiper class="swiper-box" :style="{height:swiperheight+'px'}" :current="tabIndex" @change="tabChange">
				<swiper-item v-for="(items,index) in newslist" :key="index">
					<scroll-view scroll-y class="list" @scrolltolower="loadmore(index)">
						<template v-if="items.list.length>0">
							<!-- 图文列表 -->
							<block v-for="(item,index1) in items.list" :key="index1">
								<index-list :item="item" :index="index1"></index-list>
							</block>
							<!-- 上拉加载 -->
							<load-more :loadtext="items.loadtext"></load-more>
						</template>
						<template v-else-if="!items.firstload">
							<view style="font-size: 50upx;font-weight: bold;color: #CCCCCC;
							padding-top: 100upx;" class="u-f-ajc">Loading ...</view>
						</template>
						<template v-else>
							<!-- 无内容默认 -->
							<no-thing></no-thing>
						</template>

					</scroll-view>
				</swiper-item>
			</swiper>
		</view>

	</view>
</template>


<script>
	import indexList from "../../components/index/index-list.vue";
	import swiperTabHead from "../../components/index/swiper-tab-head.vue";
	import loadMore from "../../components/common/load-more.vue";
	import noThing from "../../components/common/no-thing.vue";
	export default {
		components: {
			indexList,
			swiperTabHead,
			loadMore,
			noThing
		},
		data() {
			return {
				swiperheight: 500,
				tabIndex: 0,
				tabBars: [],
				newslist: [],


			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					let height = res.windowHeight - uni.upx2px(100)
					this.swiperheight = height;
				}
			});
			this.getNav()
		},
		//跳转搜索页面
		onNavigationBarSearchInputClicked() {
			uni.navigateTo({
				url: '../search/search'
			})
		},
		//监听原生标题点击事件
		onNavigationBarButtonTap(e) {
			//console.log(JSON.stringify(e,index))
			switch (e.index) {
				case 1:
					uni.navigateTo({
						url: '../add-input/add-input'
					})
					break;
			}
		},
		
		methods: {
			// 获取文章分类
			async getNav() {
				let [err, res] = await this.$http.get('/postclass')
					if(!this.$http.errorCheck(err,res)){
						return;
					}
				let list = res.data.data.list;
				let arr = [];
				let arr2 = [];
				for (let i = 0; i < list.length; i++) {
					arr.push({
						id:list[i].id,
						name:list[i].classname
					})
					arr2.push({
						loadtext:"上拉加载更多",
						list:[],
						page:1,
						firstload:false
					});
				}
				this.tabBars = arr;
				this.newslist = arr2;
				this.tabBars.length > 0 && this.getList();

			},
			// 获取指定列表
			async getList(){
				let currentIndex = this.tabIndex;
				let url = `/postclass/${this.tabBars[this.tabIndex].id}/post/${this.newslist[this.tabIndex].page}`;
				let [err,res] = await this.$http.get(url,{},{token:true});
				//console.log(res)
				let error = this.$http.errorCheck(err,res,()=>{
					this.newslist[currentIndex].loadtext="上拉加载更多";
				},()=>{
					this.newslist[currentIndex].loadtext="上拉加载更多";
				});
				if (!error) return;
				let arr = [];
				let list = res.data.data.list;
				for (let i = 0; i < list.length; i++) {
					arr.push(this.__format(list[i]));
				}
				this.newslist[currentIndex].list = this.newslist[currentIndex].page > 1 ? this.newslist[currentIndex].list.concat(arr) : arr;
				this.newslist[currentIndex].firstload = true;
				if (list.length < 10) {
					this.newslist[currentIndex].loadtext="没有更多数据了";
				}else{
					this.newslist[currentIndex].loadtext="上拉加载更多";
				}
				return;
			},
			// 格式转化
			__format(item){
				return {
					userid:item.user.id,
					userpic:item.user.userpic,
					username:item.user.username,
					isguanzhu:!!item.user.fens.length,
					id:item.id,
					title:item.title,
					type:"img", // img:图文,video:视频
					titlepic:item.titlepic,
					video:false,
					path:item.path,
					share:!!item.share,
					infonum:{
						index:(item.support.length>0) ? (item.support[0].type+1) : 0,//0:没有操作，1:顶,2:踩；
						dingnum:item.ding_count,
						cainum:item.cai_count,
					},
					commentnum:item.comment_count,
					sharenum:item.sharenum,
				}
			},
			// 上拉加载
			loadmore(index) {
				if (this.newslist[index].loadtext != "上拉加载更多") {
					return;
				}
				// 修改状态
				this.newslist[index].loadtext = "加载中...";
				// 获取数据
				
				this.newslist[this.tabIndex].page++;
				this.getList();
			},
			// tabbar点击事件
			tabtap(index) {
				this.tabIndex = index;
			},
			// 滑动事件
			tabChange(e) {
				this.tabIndex = e.detail.current;
				this.getList();
			}
		},
	}
</script>

<style>

</style>
