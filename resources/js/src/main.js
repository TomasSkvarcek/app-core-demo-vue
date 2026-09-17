/* core */
import { createApp } from 'vue';
import i18next from "@/src/core/translation/i18n";
import I18NextVue from "i18next-vue";
import {createPinia} from "pinia";
import router from "@/src/router";

/* components */
import App from '@/src/App.vue';

/* external libs */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import '@vuepic/vue-datepicker/dist/main.css'

/* css */
import '../../sass/app.scss';

const app = createApp(App);

app.use(I18NextVue, { i18next });
app.use(createPinia());
app.use(router);

app.mount('#root');
