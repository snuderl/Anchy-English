import { createRouter, createWebHistory } from 'vue-router'
import PublicWorksheetList from '@/views/PublicWorksheetList.vue'
import WordPracticeList from '@/views/WordPracticeList.vue'
import WorksheetSolve from '@/views/WorksheetSolve.vue'
import AdminLayout from '@/views/AdminLayout.vue'
import WorksheetList from '@/views/WorksheetList.vue'
import WorksheetEdit from '@/views/WorksheetEdit.vue'
import Categories from '@/views/Categories.vue'
import ExerciseSetList from '@/views/ExerciseSetList.vue'
import ExerciseSetPractice from '@/components/ExerciseSetPractice.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: PublicWorksheetList
  },
  {
    path: '/word-practice',
    name: 'word-practice',
    component: WordPracticeList
  },
  {
    path: '/worksheets/:id',
    name: 'worksheet-solve',
    component: WorksheetSolve
  },
  {
    path: '/exercise-sets',
    name: 'exercise-sets',
    component: ExerciseSetList
  },
  {
    path: '/exercise-sets/:id/practice',
    name: 'exercise-practice',
    component: ExerciseSetPractice
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