import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
// import './utils/SetRem';
import {
    Button,
    Field,
    NavBar,
    Form,
    Calendar,
    Toast,
    CellGroup,
    Popup,
    Picker,
    DatetimePicker,
    Uploader,
    Area,
    Dialog,
    NumberKeyboard,
    Switch,
    Grid,
    GridItem,
    Empty,
    Search,
    Sticky,
    PullRefresh,
    List,
} from 'vant';
import 'vant/lib/index.css';
import 'lib-flexible';
import axios from './utils/axios';

Vue.prototype.$http = axios;

Vue.use(Popup);
Vue.use(Button);
Vue.use(Field);
Vue.use(Form);
Vue.use(NavBar);
Vue.use(Toast);
Vue.use(Calendar);
Vue.use(CellGroup);
Vue.use(Popup);
Vue.use(Picker);
Vue.use(DatetimePicker);
Vue.use(Uploader);
Vue.use(Dialog);
Vue.use(Area);
Vue.use(NumberKeyboard);
Vue.use(Switch);
Vue.use(Grid);
Vue.use(GridItem);
Vue.use(Empty);
Vue.use(Search);
Vue.use(Sticky);
Vue.use(PullRefresh);
Vue.use(List);
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
