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

      // {
      //   path: "login",
      //   // component:  LoginComponent,
      //   loadComponent: () =>
      //     import('./pages/auth/login/login.component').then((x) => x.LoginComponent),
      // },

      {
        path: "register",
        component:  RegistrationComponent
      }
       

];
