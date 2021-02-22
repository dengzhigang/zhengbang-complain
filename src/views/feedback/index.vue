<template>
    <section class="wrap">
        <span class="tips">必填项</span>
        <van-form @submit="onSubmit" @failed="onFailed" error-message-align="right" input-align="right">
            <van-field
                clickable
                name="picker"
                :value="feedbackForm.typeName"
                label="举报方式"
                placeholder="请选择举报方式"
                @click="isDisabled ? '' : (showTypePicker = true)"
                :rules="[{ required: true, message: ' ' }]"
                right-icon="arrow"
                class="long_input_label"
                :readonly="isDisabled"
            />
            <!-- required -->
            <van-popup v-model="showTypePicker" position="bottom">
                <van-picker item-height="66" show-toolbar :columns="typeOptions" @confirm="typeOnConfirm" @cancel="showTypePicker = false" />
            </van-popup>
            <div v-if="feedbackForm.typeName === '实名举报'">
                <van-field
                    v-model="feedbackForm.name"
                    name="姓名"
                    label="姓名"
                    placeholder="请输入您的姓名"
                    :rules="[{ required: true, message: ' ' }]"
                    class="long_input_label"
                    :readonly="isDisabled"
                />
                <van-field
                    v-model="feedbackForm.phone"
                    type="tel"
                    maxlength="11"
                    name="手机号码"
                    label="手机号码"
                    placeholder="请输入手机号码"
                    :rules="[{ required: true, validator: telValidator, message: ' ' }]"
                    class="long_input_label"
                    :readonly="isDisabled"
                />
            </div>
            <div v-if="feedbackForm.typeName === '匿名举报'">`
                <van-field
                    v-model="feedbackForm.email"
                    name="邮箱"
                    label="邮箱"
                    placeholder="请输入您的邮箱"
                    :rules="[{ required: true, validator: emailValidator, message: ' ' }]"
                    class="long_input_label"
                    :readonly="isDisabled"
                />
            </div>
            <van-field name="switch" label="是否是正邦内部员工" class="long_input_label" :readonly="isDisabled">
                <!-- :rules="[{ required: true, message: ' ' }]" -->
                <template #input>
                    {{ feedbackForm.isEmp | filterIsEmp }}
                    <van-switch v-model="feedbackForm.isEmp" size="20" style="margin-left: 26px;" :disabled="isDisabled" />
                </template>
            </van-field>
            <van-field
                v-model="feedbackForm.informants"
                name="被举报人姓名"
                label="被举报人姓名"
                placeholder="被举报人姓名"
                :rules="[{ required: true, message: ' ' }]"
                class="long_input_label"
                :readonly="isDisabled"
                @click="handleSearch"
            />
            <div v-if="isShow">
                <van-field
                    v-model="feedbackForm.bjrbid"
                    name="被举报人AD号"
                    label="被举报人AD号"
                    placeholder="被举报人AD号"
                    :rules="[{ required: true, message: ' ' }]"
                    class="long_input_label"
                    :readonly="isDisabled"
                />
                <van-field
                    v-model="feedbackForm.ext4"
                    name="被举报人所属板块"
                    label="被举报人所属板块"
                    placeholder="被举报人所属板块"
                    :rules="[{ required: true, message: ' ' }]"
                    class="long_input_label"
                    :readonly="isDisabled"
                />
                <van-field
                    v-model="feedbackForm.bjbrbm"
                    rows="1"
                    autosize
                    type="textarea"
                    name="被举报人部门"
                    label="被举报人部门"
                    placeholder="被举报人部门"
                    :rules="[{ required: true, message: ' ' }]"
                    class="long_input_label"
                    :readonly="isDisabled"
                />
                <van-field
                    v-model="feedbackForm.informantsPost"
                    name="被举报人岗位名称"
                    label="被举报人岗位名称"
                    placeholder="请输入被举报人岗位名称"
                    :rules="[{ required: true, message: ' ' }]"
                    class="long_input_label"
                    :readonly="isDisabled"
                />
            </div>
            <van-field
                v-model="feedbackForm.content"
                rows="5"
                autosize
                label="举报内容"
                type="textarea"
                maxlength="1200"
                placeholder="举报事项等内容，不超过1200字"
                :rules="[{ required: true, message: ' ' }]"
                show-word-limit
                class="long_input_label"
                :readonly="isDisabled"
            />
            <span class="tips">选填项</span>
            <van-cell-group>
                <div class="uploadImage">
                    <span class="tips">
                        图片上传
                    </span>
                    <i>注:单张图片大小不能超过10M,图片总数不超过10张</i>
                </div>
                <van-grid :column-num="5" v-if="isDisabled">
                    <van-grid-item
                        v-for="(item, index) in this.feedbackForm.updateImages"
                        :key="index"
                        icon="photo-o"
                        :text="item.name"
                        @click="imgPreview(item, index, 'img')"
                    />
                </van-grid>
                <van-field name="uploader" input-align="left" class="long_input_label" v-else>
                    <template #input>
                        <van-uploader
                            v-model="feedbackForm.updateImages"
                            :max-size="10 * 1024 * 1024"
                            :max-count="10"
                            :before-read="beforeRead"
                            :after-read="afterUploadImages"
                            :before-delete="beforeDelete"
                            :disabled="isDisabled"
                        />
                    </template>
                </van-field>
                <van-grid :column-num="1" v-if="!feedbackForm.updateImages.length && isDisabled">
                    <van-grid-item text="暂无图片" />
                </van-grid>
            </van-cell-group>
            <van-cell-group>
                <div class="uploadImage">
                    <span class="tips">
                        附件上传
                    </span>
                    <i style="display: block;">注:单个附件大小不能超过100M,附件总数不超过10个</i>
                    <!-- <i>注：单个附件大小不能超过10M，附件总数不超过5个</i> -->
                </div>
                <van-grid :column-num="4" v-if="isDisabled">
                    <van-grid-item
                        v-for="(item, index) in this.feedbackForm.updateFiles"
                        :key="index"
                        icon="description"
                        :text="item.name"
                        @click="filePreview(item, index)"
                    />
                </van-grid>
                <van-field name="uploader" input-align="left" class="long_input_label" v-else>
                    <template #input>
                        <van-uploader
                            v-model="feedbackForm.updateFiles"
                            accept="file"
                            :max-size="100 * 1024 * 1024"
                            :max-count="10"
                            :before-read="beforeFiles"
                            :before-delete="beforeDelete"
                            :after-read="afterUploadFiles"
                            :disabled="isDisabled"
                        >
                            <van-button icon="plus" type="info">选择附件</van-button>
                        </van-uploader>
                    </template>
                </van-field>
                <van-grid :column-num="1" v-if="!feedbackForm.updateFiles.length && isDisabled">
                    <van-grid-item text="暂无附件" />
                </van-grid>
            </van-cell-group>
            <div style="margin: 16px;" v-if="!isDisabled">
                <!-- round -->
                <van-button block type="info" native-type="submit" :loading="btnLoading">
                    提 交
                </van-button>
            </div>
        </van-form>
    </section>
</template>

<script>
import qs from 'qs';
import { ImagePreview } from 'vant';
export default {
    data() {
        return {
            feedbackForm: {
                type: 1, // 举报类型
                typeName: '实名举报',
                name: '', // 姓名
                phone: '', // 手机号码
                email: '', // 邮箱
                isEmp: false, // 是否正邦内部员工
                informants: '', // 被举报人姓名
                informantsPost: '', // 被举报人岗位
                content: '', // 举报内容
                updateImages: [], // 图片
                updateFiles: [], // 附件

                bjrbid: '', // ad号
                ext4: '', // 所属板块
                bjbrbm: '', // 部门
            },
            isDisabled: false,
            btnLoading: false,
            isShow: false,
            showTypePicker: false,
            typeOptions: [
                { text: '实名举报', value: 1 },
                { text: '匿名举报', value: 2 },
            ],
            upLoadParams: null,
            w_sid: '',
            formData: null,
            viewParams: '',
            imgData: null,
            fileData: null,
            imgURL: '',
            fileURL: '',
            fileFile: '',
            reViewData: {},
        };
    },
    filters: {
        filterIsEmp(val) {
            return val ? '是' : '否';
        },
    },
    deactivated() {},
    activated() {
        const informantsData = JSON.parse(sessionStorage.getItem('informantsData'));
        if (informantsData) {
            this.feedbackForm.informants = informantsData.name; // 被举报人姓名
            if (this.feedbackForm.informants) {
                this.isShow = true;
            }
            this.feedbackForm.bjrbid = informantsData.uID; // 被举报人ad号
            this.feedbackForm.ext4 = informantsData.ext4; // 被举报人板块
            this.feedbackForm.bjbrbm = informantsData.bjbrbm.substr(0, informantsData.bjbrbm.length - 1); // 被举报人部门
            this.feedbackForm.informantsPost = informantsData.positionName; // 被举报人岗位
        }
    },
    created() {
        console.log('2020-12-11 18:53');
        this.getParams();
        if (this.$route.params.op) {
            this.isDisabled = this.isShow = true;
            this.getReViewData(this.$route.params.op);
        } else {
            this.isDisabled = false;
        }
    },
    methods: {
        handleSearch() {
            this.$router.push('/empInfo');
        },
        imgPreview(val, idx, type) {
            if (typeof val.data.groupValue === 'object') {
                val.data.groupValue = JSON.stringify(val.data.groupValue);
            }
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: qs.stringify(val.data),
                url: 'portal/r/jd',
            };
            this.$http(options).then(res => {
                const { data } = res.data;
                this.imgURL = data.url && data.url.replace('.', '');
                window.location.href = 'http://pal.zhengbang.com/r' + this.imgURL;
                // window.location.href = 'http://bpmuat.zberpnc.com/r' + this.imgURL;
            });
        },
        filePreview(val, idx) {
            if (typeof val.data.groupValue === 'object') {
                val.data.groupValue = JSON.stringify(val.data.groupValue);
            }
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: qs.stringify(val.data),
                url: 'portal/r/jd',
            };
            this.$http(options)
                .then(res => {
                    const { data } = res.data;
                    this.imgURL = data.url && data.url.replace('.', '');
                    window.location.href = 'http://pal.zhengbang.com/r' + this.imgURL;
                    // window.location.href = 'http://bpmuat.zberpnc.com/r' + this.imgURL;
                })
                .catch(() => {
                    console.log('catch');
                });
        },
        beforeDelete() {
            if (this.isDisabled) {
                return false;
            } else {
                return true;
            }
        },
        // 表单回显
        getReViewData(id) {
            this.$http
                .get('r/w?cmd=com.awspaas.user.apps.zbts.info', {
                    params: {
                        id, // boid
                    },
                })
                .then(res => {
                    const { data } = res;
                    let reViewData = JSON.parse(JSON.stringify(data));
                    this.feedbackForm.typeName = Number(reViewData.jbfs) === 1 ? '实名举报' : '匿名举报';
                    this.feedbackForm.name = reViewData.xm; // 姓名
                    this.feedbackForm.phone = reViewData.sjh; // 电话
                    this.feedbackForm.email = reViewData.jbryx; // 举报人邮箱
                    this.feedbackForm.isEmp = JSON.parse(reViewData.jfnbyg);
                    this.feedbackForm.informants = reViewData.bjbrxm;
                    this.feedbackForm.informantsPost = reViewData.bjbrgw;
                    this.feedbackForm.bjrbid = reViewData.bjrbid; // 被举报人ad号
                    this.feedbackForm.ext4 = reViewData.ext4; // 被举报人所属板块
                    this.feedbackForm.bjbrbm = reViewData.bjbrbm; // 被举报人部门
                    this.feedbackForm.content = reViewData.jbmw; // 举报内容
                    var a = 0;
                    var b = 0;
                    reViewData.fj &&
                        reViewData.fj.split('@@@@').forEach((item, index) => {
                            let fileType = item.split('.')[item.split('.').length - 1];
                            if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png') {
                                a++;
                                this.imgData = {
                                    appId: 'com.awspaas.user.apps.zb.hr',
                                    repositoryName: '!form-ui-file-',
                                    groupValue: {},
                                    fileValue: 'FJ',
                                    fileName: '', // test.png
                                    editType: 0,
                                    copyType: 1,
                                    printType: 1,
                                    localType: 2,
                                    showHandToolbar: 0,
                                    sid: reViewData.sid,
                                    cmd: 'CLIENT_UI_FILE_PREVIEW_FILE',
                                    documentHeight: '95%',
                                    name: '图片',
                                };
                                reViewData.filelis.forEach(i => {
                                    if (i.filename === item) {
                                        this.imgData.sourceGroupValue = i.id;
                                        this.$set(this.imgData.groupValue, 'formFileId', i.id);
                                        this.$set(this.imgData.groupValue, 'boDefId', reViewData.groupValue.boDefId);
                                        this.$set(this.imgData.groupValue, 'boId', reViewData.groupValue.boId);
                                        this.$set(this.imgData.groupValue, 'boItemName', reViewData.groupValue.boItemName);
                                        this.$set(this.imgData.groupValue, 'processInstId', reViewData.groupValue.processInstId);
                                        this.$set(this.imgData.groupValue, 'remark', reViewData.groupValue.remark);
                                        this.$set(this.imgData.groupValue, 'taskInstId', reViewData.groupValue.taskInstId);
                                    }
                                });
                                this.imgData.fileName = item;
                                this.imgData.name = this.imgData.name + a + '.' + fileType;
                                // let baseUrl = this.convertObj(this.imgData);
                                this.feedbackForm.updateImages.push({
                                    name: this.imgData.name,
                                    data: this.imgData,
                                });
                            } else {
                                b++;
                                this.fileData = {
                                    appId: 'com.awspaas.user.apps.zb.hr',
                                    repositoryName: '!form-ui-file-',
                                    groupValue: {},
                                    fileValue: 'FJ',
                                    fileName: '', // test.png
                                    editType: 0,
                                    copyType: 1,
                                    printType: 1,
                                    localType: 2,
                                    showHandToolbar: 0,
                                    sid: reViewData.sid,
                                    cmd: 'CLIENT_UI_FILE_PREVIEW_FILE',
                                    documentHeight: '95%',
                                    name: '附件',
                                };
                                reViewData.filelis.forEach(i => {
                                    if (i.filename === item) {
                                        this.fileData.sourceGroupValue = i.id;
                                        this.$set(this.fileData.groupValue, 'formFileId', i.id);
                                        this.$set(this.fileData.groupValue, 'boDefId', reViewData.groupValue.boDefId);
                                        this.$set(this.fileData.groupValue, 'boId', reViewData.groupValue.boId);
                                        this.$set(this.fileData.groupValue, 'boItemName', reViewData.groupValue.boItemName);
                                        this.$set(this.fileData.groupValue, 'processInstId', reViewData.groupValue.processInstId);
                                        this.$set(this.fileData.groupValue, 'remark', reViewData.groupValue.remark);
                                        this.$set(this.fileData.groupValue, 'taskInstId', reViewData.groupValue.taskInstId);
                                    }
                                });
                                this.fileData.fileName = item;
                                this.fileData.name = this.fileData.name + b + '.' + fileType;
                                // let baseUrl = this.convertObj(fileData);
                                this.feedbackForm.updateFiles.push({
                                    name: this.fileData.name,
                                    data: this.fileData,
                                });
                            }
                        });
                })
                .catch(() => {});
        },
        // 将对象转换成URL
        convertObj(data) {
            var _result = [];
            for (var key in data) {
                var value = data[key];
                if (value.constructor == Array) {
                    value.forEach(function(_value) {
                        _result.push(key + '=' + _value);
                    });
                } else {
                    _result.push(key + '=' + value);
                }
            }
            return _result.join('&');
        },
        telValidator(val) {
            if (val) {
                return /^[1]([3-9])[0-9]{9}$/.test(val);
            } else {
                return true;
            }
        },
        emailValidator(val) {
            if (val) {
                return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(val);
            } else {
                true;
            }
        },
        beforeRead(file) {
            //上传之前校验
            let fileType = file.name
                .split('.')
                .pop()
                .toLocaleLowerCase();
            if (file.size > 10 * 1024 * 1024) {
                this.$toast.fail('请选择10M以内的图片上传');
                return false;
            }
            if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png') {
                return true;
            } else {
                this.$toast.fail('请选择jpg、jpeg、png格式的图片上传');
                return false;
            }
        },
        afterUploadImages(file) {
            file.status = 'uploading';
            let params = new FormData();
            params.append('file', file.file);
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'multipart/form-data' },
                data: params,
                params: this.upLoadParams,
                url: 'portal/r/uf',
            };
            this.upLoadParams &&
                this.$http(options)
                    .then(res => {
                        let { files } = res.data;
                        if (files.name) {
                            file.status = 'success';
                        } else {
                            file.status = 'failed';
                            this.$toast.fail('上传失败');
                        }
                    })
                    .catch(res => {
                        file.status = 'failed';
                        this.$toast.fail('上传失败！');
                    });
        },
        beforeFiles(file) {
            let fileType = file.name
                .split('.')
                .pop()
                .toLocaleLowerCase();
            let fileSize = file.size;
            if (fileSize > 100 * 1024 * 1024) {
                this.$toast.fail('请上传小于10M的文件！');
                return false;
            }
            return true;
        },
        afterUploadFiles(file) {
            file.status = 'uploading';
            let params = new FormData();
            params.append('file', file.file);
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'multipart/form-data' },
                data: params,
                params: this.upLoadParams,
                url: 'portal/r/uf',
            };
            this.upLoadParams &&
                this.$http(options)
                    .then(res => {
                        let { files } = res.data;
                        if (files.name) {
                            file.status = 'success';
                        } else {
                            file.status = 'failed';
                            this.$toast.fail('上传失败');
                        }
                    })
                    .catch(res => {
                        file.status = 'failed';
                        this.$toast.fail(res);
                    });
        },
        onSubmit() {
            this.$dialog
                .confirm({
                    message: '您确定要提交举报信息吗？',
                    confirmButtonText: '确定',
                })
                .then(() => {
                    let imgNames = this.feedbackForm.updateImages.map(item => item.file.name);
                    let fileNames = this.feedbackForm.updateFiles.map(item => item.file.name);
                    let allFiles = [...imgNames, ...fileNames].toString().replace(/,/g, '@@@@');
                    const para = {
                        jbfs: this.feedbackForm.type, // 举报方式
                        xm: this.feedbackForm.name, // 姓名
                        sjh: this.feedbackForm.phone, // 手机号
                        jbryx: this.feedbackForm.email, // 举报人邮箱
                        jfnbyg: this.feedbackForm.isEmp, // 是否是正邦内部员工
                        bjbrxm: this.feedbackForm.informants, // 被举报人姓名
                        bjbrgw: this.feedbackForm.informantsPost, // 被举报人岗位名称
                        jbmw: this.feedbackForm.content, // 举报内容
                        fj: allFiles, // 图片附件
                        id: this.upLoadParams.groupValue.boId, // 唯一标识
                        processInstId: this.upLoadParams.groupValue.processInstId,
                        bjrbid: this.feedbackForm.bjrbid, //被举报人ad号
                        ext4: this.feedbackForm.ext4, // 被举报人所属板块
                        bjbrbm: this.feedbackForm.bjbrbm, // 被举报人所属板块
                    };
                    let dataObj = qs.stringify(para);
                    const config = {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    };
                    // this.isDisabled = true;
                    this.btnLoading = true;
                    this.$http
                        .post('r/w?cmd=com.awspaas.user.apps.zbts.addbo', dataObj, config)
                        .then(res => {
                            const { code } = res.data;
                            this.btnLoading = false;
                            if (code === '200') {
                                this.$router.replace('/finish');
                            } else {
                                this.$toast.fail('提交失败!');
                            }
                        })
                        .catch(err => {
                            this.btnLoading = false;
                            this.$toast.fail('提交失败!');
                        });
                })
                .catch(() => {
                    console.log(' onSubmit Catch');
                    // on cancel
                });
        },
        onFailed(errorInfo) {
            if (errorInfo.errors !== 0) {
                errorInfo.errors.forEach(item => {
                    if (item.name === '手机号码') {
                        this.$toast.fail('请填写正确的手机号码!');
                    } else if (item.name === '邮箱') {
                        this.$toast.fail('请填写正确的邮箱!');
                    } else {
                        this.$toast.fail('请完善必填项');
                    }
                });
            }
        },
        typeOnConfirm(val) {
            this.feedbackForm.type = val.value;
            this.feedbackForm.typeName = val.text;
            this.showTypePicker = false;
        },
        getParams() {
            this.$http
                .get('r/w?cmd=com.awspaas.user.apps.zbts.getparams')
                .then(res => {
                    const { status, data } = res;
                    if (status === 200) {
                        this.upLoadParams = data;
                    }
                })
                .catch(() => {});
        },
    },
};
</script>

<style scoped>
.wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #ecebee;
}
.tips {
    display: block;
    font-size: 28px;
    padding: 25px 0 0 25px;
    margin-bottom: 20px;
}
.long_input_label {
    border-bottom: 1px solid #d8d8d8;
}
.uploadImage {
    font-weight: 550;
    height: 120px;
    border-bottom: 1px solid #d8d8d8;
}
.uploadImage span {
    margin: unset;
    font-size: 28px;
    padding-bottom: 10px;
}
.uploadImage i {
    color: #999999;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    padding-left: 55px;
}
</style>
<style>
.long_input_label .van-cell__title {
    width: 265px;
}
.long_input_label .van-cell__title span {
    font-weight: 550;
}
</style>
