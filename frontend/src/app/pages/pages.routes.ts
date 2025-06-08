import { Routes } from '@angular/router';
import {UserComponent} from './user/user.component';
import {AdminComponent} from './admin/admin.component';

export default [
  { path: 'user', component: UserComponent },
  { path: 'admin', component: AdminComponent },
] as Routes;
