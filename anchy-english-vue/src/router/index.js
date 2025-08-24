import { createRouter, createWebHashHistory } from 'vue-router'
import WorksheetList from '@/views/WorksheetList.vue'
import WorksheetEdit from '@/views/WorksheetEdit.vue'
import Categories from '@/views/Categories.vue'

const routes = [
  {
    path: '/',
    redirect: '/worksheets'
  },
  {
    path: '/worksheets',
    name: 'worksheets',
    component: WorksheetList
  },
  {
    path: '/worksheets/new',
    name: 'worksheet-new',
    component: WorksheetEdit
  },
  {
    path: '/worksheets/:id',
    name: 'worksheet-edit',
    component: WorksheetEdit
  },
  {
    path: '/categories/:id?',
    name: 'categories',
    component: Categories
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})