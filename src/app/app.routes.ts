import { Routes } from '@angular/router';

export const appRoutes: Routes = [
    {
        path: "",
        redirectTo: "register",
        pathMatch: "full",
      },

      // {
      //   path: "login",
      //   // component:  LoginComponent,
      //   loadComponent: () =>
      //     import('./pages/auth/login/login.component').then((x) => x.LoginComponent),
      // },

      {
        path: "register",
        // component:  LoginComponent,
        loadComponent: () =>
          import('./pages/registration/registration.component').then((x) => x.RegistrationComponent),
      },

];
