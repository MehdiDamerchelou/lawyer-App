import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'login', component: () => import('pages/AuthPage.vue') },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/AddClient',
        name: 'AddClient',
        component: () => import('components/AddClient.vue'),
      },
      {
        path: '/AddComplaint',
        name: 'AddComplaint',
        component: () => import('components/AddComplaint.vue'),
      },
      {
        path: '/payments',
        name: 'payments',
        component: () => import('components/AddPayment.vue'),
      },
      {
        path: '/Calender',
        name: 'Calender',
        component: () => import('components/CalenderApp.vue'),
      },
      {
        path: '/Clientlist',
        name: 'Clientlist',
        component: () => import('components/ClientList.vue'),
      },
      {
        path: '/info',
        name: 'info',
        component: () => import('components/ExportInfo.vue'),
      },
      {
        path: '/ComplaintList',
        name: 'ComplaintList',
        component: () => import('components/ComplaintList.vue'),
      },
      {
        path: '/AddFile',
        name: 'AddFile',
        component: () => import('components/AddFile.vue'),
      },
      {
        path: '/eventFile',
        name: 'eventFile',
        component: () => import('components/EventsFile.vue'),
      },
      {
        path: '/FileList',
        name: 'FileList',
        component: () => import('components/FileList.vue'),
      },
      {
        path: '/EventList',
        name: 'EventList',
        component: () => import('components/EventsList.vue'),
      },
      {
        path: '/AddFileEvent',
        name: 'AddFileEvent',
        component: () => import('components/EventsFile.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
