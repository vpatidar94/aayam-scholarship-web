import { Routes } from '@angular/router';
import { canActivateUser } from '@core/guards/can-activate-guard';
import { RegistrationIndoreComponent } from '@pages/registration-indore/registration-indore.component';
import { RegistrationComponent } from '@pages/registration/registration.component';
import { QuestionComponent } from './pages/dashboard/question/question.component';
import { VerifyOtpComponent } from './pages/auth/verify-otp/verify-otp.component';
import { LoginComponent } from '@pages/auth/login/login.component';

export const appRoutes: Routes = [
    {
        path: "verify",
       component:  VerifyOtpComponent,
        // loadComponent: () =>
        //   import('./pages/auth/verify-otp/verify-otp.component').then((x) => x.VerifyOtpComponent),
      },
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

      {
        path: "login",
        component: LoginComponent
        // loadComponent: () =>
        //   import('./pages/auth/login/login.component').then((x) => x.LoginComponent),
      },

      

      {
        path: "dashboard",
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then((x) => x.DashboardComponent),
        canActivate: [canActivateUser]
      },

      {
        path: "instructions/:testId",
        loadComponent: () =>
          import('./pages/dashboard/instructions/instructions.component').then((x) => x.InstructionsComponent),
        canActivate: [canActivateUser]
      },
      {
        path: "test/:testId",
        loadComponent: () =>
          import('./pages/dashboard/question/question.component').then((x) => x.QuestionComponent),
        canActivate: [canActivateUser],
        canDeactivate: [(component: QuestionComponent) => component.canDeactivate()],
      },
      {
        path: "test/:testId/:mode",
        loadComponent: () =>
          import('./pages/dashboard/question/question.component').then((x) => x.QuestionComponent),
        canActivate: [canActivateUser],
        canDeactivate: [(component: QuestionComponent) => component.canDeactivate()],
      },
      {
        path: "test-schedule",
        loadComponent: () =>
          import('./pages/dashboard/test-schedule/test-schedule.component').then((x) => x.TestScheduleComponent),
        canActivate: [canActivateUser],
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
          // {
          //   path: "organisations",
          //   loadComponent: () =>
          //     import('./pages/admin/organisations/organisations.component').then((x) => x.OrganisationComponent),
          // },
          // {
          //   path: "add-organisation",
          //   loadComponent: () =>
          //     import('./pages/admin/add-organisation/add-organisation.component').then((x) => x.AddOrganisation),
          // },
          // {
          //   path: "edit-organisation/:orgId",
          //   loadComponent: () =>
          //     import('./pages/admin/add-organisation/add-organisation.component').then((x) => x.AddOrganisation),
          // },
    
        ]
      },

];
