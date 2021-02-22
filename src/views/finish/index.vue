<template>
    <section class="wrap">
        <img src="@/assets/success.png" alt="" />
        <p class="successTitle">提交完成</p>
        <p class="successInfo">我们将第一时间受理您的举报反馈信息！</p>
    </section>
</template>

<script>
export default {
    data() {
        return {};
    },
    methods: {},
    created() {},
};
</script>

<style scoped>
.wrap {
    display: flex;
    justify-content: center;
}
.wrap img {
    width: 90px;
    height: 90px;
    margin-top: 246px;
    position: absolute;
}
.wrap p {
    position: absolute;
}
.successTitle {
    color: #222222;
    font-size: 36px;
    font-weight: 550;
    margin-top: 380px;
}

.successInfo {
    margin-top: 450px;
    font-size: 28px;
    color: #999999;
}
</style>
