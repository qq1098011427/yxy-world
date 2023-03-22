import * as Router from 'vue-router';

const routes = [
    { path: '/', redirect: '/WindowMain/Chat' },
    {
        path: '/WindowMain',
        component: () => import('./Window/index.vue'),
        children: [
            { path: 'Chat', text: '消息', iconPark: 'wechat', component: () => import('./Window/WindowMain/Chat.vue') },
            { path: 'Contact', text: '设置', iconPark: 'config', component: () => import('./Window/WindowMain/Contact.vue') },
            { path: 'Collection', text: '工具', iconPark: 'toolkit', component: () => import('./Window/WindowMain/Collection.vue') },
        ],
    },
    {
        path: "/WindowSetting",
        component: () => import("./Window/WindowSetting/index.vue"),
        children: [{ path: "AccountSetting", component: () => import("./Window/WindowSetting/AccountSetting.vue") }],
    },
    {
        path: "/WindowUserInfo",
        component: () => import("./Window/WindowUserInfo/index.vue"),
    }
]

export const router = Router.createRouter({
    history: Router.createWebHistory(),
    routes
})