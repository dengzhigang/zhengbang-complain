import Vue from 'vue';
import Vuex from 'vuex';
import { setStorage, getStorage } from '@/utils/storage';
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        token: getStorage('token'), // 默认值，防止刷新vuex数据丢失
        jti: getStorage('jti'),
        userInfo: getStorage('userInfo') || {},
    },
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token;
            setStorage(token);
        },
        SET_JTI(state, jti) {
            state.jti = jti;
            setStorage(jti, 'jti');
        },
        SET_USER_INFO(state, userInfo) {
            state.userInfo = userInfo;
            setStorage(JSON.stringify(userInfo), 'userInfo');
        },
        SET_USER_INFO_UPDATE(state, newInfo) {
            for (const key in newInfo) {
                state.userInfo[key] = newInfo[key];
            }
            setStorage(JSON.stringify(state.userInfo), 'userInfo');
        },
    },
    actions: {
        USER_LOGIN({ commit }, payload) {
            // 传手机号进来，去登录，登陆后commitSET_TOKEN
            for (const key in payload) {
                if (key == 'token') {
                    commit('SET_TOKEN', payload[key]);
                } else if (key == 'jti') {
                    commit('SET_JTI', payload[key]);
                } else if (key == 'userInfo') {
                    commit('SET_USER_INFO', payload[key]);
                }
            }
        },
        UPDATE_USER_INFO({ commit }, payload) {
            commit('SET_USER_INFO_UPDATE', payload);
        },
    },
    modules: {},
});
