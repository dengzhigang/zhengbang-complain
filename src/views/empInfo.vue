<template>
    <div>
        <van-sticky>
            <van-search v-model="searchVal" show-action placeholder="请输入被举报人姓名" @search="onSearch" @cancel="onCancel" background="#eee" />
        </van-sticky>
        <van-pull-refresh v-model="refresh" @refresh="onRefresh">
            <van-list v-model="loading" :finished="finished" :finished-text="finishedText" @load="onLoad">
                <div class="list_item" v-for="(item, index) in list" :key="index" @click="submit(item)">
                    <p class="item_name">{{ item.userName }}/{{ item.uID }}</p>
                    <p class="item_info">{{ item.showtextsuffix }}{{ item.positionName }}</p>
                </div>
            </van-list>
            <van-empty v-if="!loading && !list.length" description="暂无数据" />
        </van-pull-refresh>
    </div>
</template>
<script>
export default {
    data() {
        return {
            searchVal: '',
            refresh: false,
            finished: true,
            loading: false,
            finishedText: '',
            list: [],

            current: 0,
            size: 15,
            pages: 1,
        };
    },
    methods: {
        onSearch() {
            this.finished = false;
            this.loading = true;
            this.current = 1;
            this.list = [];
            this.getList();
        },
        onCancel() {
            this.searchVal = '';
            this.list = [];
            this.onSearch();
        },
        onRefresh() {
            this.refresh = true;
            this.onSearch();
        },
        onLoad() {
            this.current++;
            if (this.current > this.pages) {
                this.loading = false;
                this.finished = true;
                this.finishedText = this.pages === 0 || this.pages === 1 ? '' : '没有更多数据了';
                return false;
            }
            this.getList();
        },
        getList() {
            this.$http
                .get('r/w?cmd=com.awspaas.user.apps.zbts.queryuser', {
                    params: {
                        keyWord: this.searchVal,
                        page: this.current,
                        limit: this.size,
                    },
                })
                .then(res => {
                    let { list, totalPageNum } = res.data.data;
                    this.list = this.list.concat(list);
                    this.pages = totalPageNum;
                    this.loading = false;
                    this.refresh = false;
                    this.finished = false;
                })
                .catch(() => {
                    this.loading = false;
                    this.refresh = false;
                    this.finished = false;
                });
        },
        submit(row) {
            sessionStorage.setItem(
                'informantsData',
                JSON.stringify({ uID: row.uID, name: row.userName, ext4: row.ext4, bjbrbm: row.showtextsuffix, positionName: row.positionName })
            );
            this.$router.back();
        },
    },
};
</script>

<style lang="scss" scoped>
.van-list {
    padding: 0 12.5px;
}
.list_item {
    padding: 14.5px 0 13px;
    border-bottom: 1px solid #e4e7ed;
}
.item_name {
    font-size: 28px;
    font-weight: 600;
    line-height: 22.5px;
    color: #222;
    margin-bottom: 6px;
}
.item_info {
    font-size: 26px;
    font-weight: 500;
    line-height: 35px;
    color: #999;
}
</style>
