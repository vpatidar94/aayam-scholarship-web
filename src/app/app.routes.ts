import { Routes } from '@angular/router';
import { RegistrationIndoreComponent } from '@pages/registration-indore/registration-indore.component';
import { RegistrationComponent } from '@pages/registration/registration.component';

export const appRoutes: Routes = [
    
  {
    path: "register-indore",
    component:  RegistrationIndoreComponent
  },
  
  {
        path: "",
        component: RegistrationComponent
      },

      {
        path: "register",
        component:  RegistrationComponent
      },

      {
        path: "admin-mayank",
        loadComponent: () =>
          import('./pages/admin/users/users.component').then((x) => x.UsersComponent),
      },

       

];
