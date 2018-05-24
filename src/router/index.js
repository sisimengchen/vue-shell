import Vue from 'vue';
import Router from 'vue-router';
import Home from '@pages/Home';
import Exception404 from '@pages/Exception/404';

Vue.use(Router);

export default new Router({
  mode: process.env.TARGET === 'githubpages' ? 'hash' : 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '*',
      name: '404',
      component: Exception404
    }
  ]
});
