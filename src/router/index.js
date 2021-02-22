import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login/index.vue'),
    },
    {
        path: '/finish',
        name: 'finish',
        component: () => import('../views/finish/index.vue'),
    },
    {
        path: '/feedback/:op?',
        name: 'feedback',
        component: () => import('../views/feedback/index.vue'),
        meta: {
            title: '正邦举报信息填写',
            keepAlive: true,
        },
    },
    {
        path: '/empInfo',
        name: 'empInfo',
        component: () => import('../views/empInfo.vue'),
    },
];

const router = new VueRouter({
    routes,
});

router.beforeEach((to, from, next) => {
    let locationHref = window.location.href;
    let startNum = locationHref.indexOf('id=');
    let idStr;
    if (startNum != -1) {
        idStr = locationHref.substr(startNum + 3, 36);
    }
    if (locationHref.indexOf('op=view') != -1 && to.name === 'login') {
        console.log('111');
        next({ name: 'feedback', params: { op: idStr } });
    } else {
        if (to.name === 'login' || to.name === 'finish' || to.name === 'feedback' || to.name === 'empInfo') {
            console.log('222');
            next();
        } else if (to.path.indexOf('/offerLogin') != -1) {
            console.log('333');
            next();
        } else {
            console.log('444');
            next({ path: '/login' });
        }
    }
});

export default router;
