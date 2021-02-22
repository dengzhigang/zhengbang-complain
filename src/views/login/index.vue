<template>
    <section class="login">
        <div class="login_logo">
            <img src="@/assets/wx_logo.png" alt />
            <!-- to="feedback" -->
            <!-- <van-button type="info" class="login_btn" to="feedback" @click="handleComplaint">我要举报</van-button> -->
        </div>
        <van-dialog v-model="show" title="本平台温馨提示" confirm-button-text="同 意" :message="tips" message-align="left" @confirm="handleConfirm"></van-dialog>
    </section>
</template>

<script>
export default {
    data() {
        return {
            show: true,
            tips: `
            <div>1、如您发现正邦集团干部员工有违反廉洁自律、职业操守、工作规定的，请您举报。</div>
            <div>2、我们建议您选择实名制并如实反映有关情况，您的个人资料、反映的内容将严格保密。如您选择匿名举报，可能会影响您反映问题的解决效果。</div>
            <div>3、我们将对您所反映的问题跟进处理。</div>
            `,
        };
    },
    methods: {
        // handleComplaint() {
        //     this.$router.push({
        //         name: `feedback`,
        //         params: {
        //             flag: 'add',
        //         },
        //     });
        // },
        handleConfirm(){
            this.$router.push('/feedback');
        },
    },
};
</script>

<style scoped>
.login_logo {
    width: 100%;
    height: 1332px;
    display: flex;
    justify-content: center;
}
.login_logo img {
    width: 350px;
    height: 95px;
    margin-top: 133px;
}
.login_logo .login_btn {
    width: 580px;
    height: 100px;
    margin-top: 478px;
    font-size: 32px;
    position: absolute;
}
.login_dialog {
    width: 560px;
    height: 660px;
    font-size: 28px;
}
</style>
<style>
.login_dialog .van-dialog__header {
    font-size: 32px;
    font-weight: 600;
    padding-bottom: 32px;
    border-bottom: 1px solid #dcd9d9;
}
.login_dialog p {
    padding: 0 25px 0 25px;
}
.login .van-dialog__message {
    white-space: pre-line;
    padding: 24px 48px 0 48px;
}
</style>
