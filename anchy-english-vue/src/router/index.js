import { createRouter, createWebHistory } from 'vue-router'
import PublicWorksheetList from '@/views/PublicWorksheetList.vue'
import WorksheetSolve from '@/views/WorksheetSolve.vue'
import AdminLayout from '@/views/AdminLayout.vue'
import WorksheetList from '@/views/WorksheetList.vue'
import WorksheetEdit from '@/views/WorksheetEdit.vue'
import Categories from '@/views/Categories.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: PublicWorksheetList
  },
  {
    path: '/worksheets/:id',
    name: 'worksheet-solve',
    component: WorksheetSolve
  },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        redirect: '/admin/worksheets'
      },
      {
        path: 'worksheets',
        name: 'admin-worksheets',
        component: WorksheetList
      },
      {
        path: 'worksheets/new',
        name: 'admin-worksheet-new',
        component: WorksheetEdit
      },
      {
        path: 'worksheets/:id',
        name: 'admin-worksheet-edit',
        component: WorksheetEdit
      },
      {
        path: 'categories/:id?',
        name: 'admin-categories',
        component: Categories
      }
    ]
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})