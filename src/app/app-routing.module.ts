import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CookieEditorComponent} from './cookie-editor/cookie-editor.component';
// import {AboutComponent} from './about/about/about.component';


const routes: Routes = [
  {path: '', component: CookieEditorComponent},
  {path: 'draw', component: CookieEditorComponent},
  {path: 'draw/:continueAdd', component: CookieEditorComponent},
  // {
  //   path: 'about',
  //   loadChildren: () => import('./about/about.module').then(m => m.AboutModule),
  //   component: AboutComponent
  // },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
