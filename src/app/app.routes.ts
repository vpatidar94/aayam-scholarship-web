import { Routes } from '@angular/router';
import { canActivateUser, canUnAuthenticateUser } from '@core/guards/can-activate-guard';
import { RegistrationIndoreComponent } from '@pages/registration-indore/registration-indore.component';
import { RegistrationComponent } from '@pages/registration/registration.component';
import { QuestionComponent } from './pages/dashboard/question/question.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegistrationAdminComponent } from '@pages/registration-admin/registration-admin.component';

export const appRoutes: Routes = [

  {
    path: "register-indore",
    component: RegistrationIndoreComponent
  },

  {
    path: "",
    component: LoginComponent,
    canActivate: [canUnAuthenticateUser]
  },

  {
    path: "register",
    component: RegistrationComponent
  },

  {
    path: "register-admin",
    component: RegistrationAdminComponent
  },

  {
    path: "admin-mayank",
    loadComponent: () =>
      import('./pages/admin/users/users.component').then((x) => x.UsersComponent),
  },

  {
    path: "login",
    loadComponent: () =>
      import('./pages/auth/login/login.component').then((x) => x.LoginComponent),
    canActivate: [canUnAuthenticateUser]
  },

  {
    path: "verify",
    // component:  LoginComponent,
    loadComponent: () =>
      import('./pages/auth/verify-otp/verify-otp.component').then((x) => x.VerifyOtpComponent),
  },

  {
    path: "dashboard",
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((x) => x.DashboardComponent),
    canActivate: [canActivateUser]
  },

      {
        path: "instructions/:stream",
        loadComponent: () =>
          import('./pages/dashboard/instructions/instructions.component').then((x) => x.InstructionsComponent),
        canActivate: [canActivateUser]
      },
      {
        path: "test/:stream",
        loadComponent: () =>
          import('./pages/dashboard/question/question.component').then((x) => x.QuestionComponent),
        canActivate: [canActivateUser],
        canDeactivate: [(component: QuestionComponent) => component.canDeactivate()],
      },
      {
        path: "test/:stream/:mode",
        loadComponent: () =>
          import('./pages/dashboard/question/question.component').then((x) => x.QuestionComponent),
        canActivate: [canActivateUser],
        canDeactivate: [(component: QuestionComponent) => component.canDeactivate()],
      },
      

  {
    path: "admin-details",
    // component:  LoginComponent,
    loadComponent: () =>
      import('./pages/auth-admin/enter-admin-details/enter-admin-details.component').then((x) => x.EnterAdminDetailsComponent),
  },
  {
    path: "admin",
    loadComponent: () =>
      import('./pages/admin/admin.component').then((x) => x.AdminComponent),
    children: [
      {
        path: "",
        redirectTo: "tests",
        pathMatch: "full",
      },
      {
        path: "tests",
        loadComponent: () =>
          import('./pages/admin/tests/tests.component').then((x) => x.TestsComponent),
      },
      {
        path: "users",
        loadComponent: () =>
          import('./pages/admin/users/users.component').then((x) => x.UsersComponent),
      },
      {
        path: "test-result/:testId",
        loadComponent: () =>
          import('./pages/admin/test-result/test-result.component').then((x) => x.TestResultComponent),
      },
      {
        path: "add-test",
        loadComponent: () =>
          import('./pages/admin/add-test/add-test.component').then((x) => x.AddTestComponent),
      },
      {
        path: "edit-test/:testId",
        loadComponent: () =>
          import('./pages/admin/add-test/add-test.component').then((x) => x.AddTestComponent),
      },
    ]
  },
];
