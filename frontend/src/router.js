import Vue from 'vue';
import Router from 'vue-router';
import Users from './components/Users';
import Status from './components/Status';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'users',
            component: Users
        },
        {
            path: '/home',
            redirect: '/'
        },
        {
            path: '/status',
            name: 'status',
            component: Status
        }
    ]

});