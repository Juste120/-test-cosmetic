import { Routes } from '@angular/router';
import { AppLayout} from './layout/component/app.layout';

export const appRoutes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      { path: 'pages', loadChildren: () => import('./pages/pages.routes') }
    ]
  },
];

