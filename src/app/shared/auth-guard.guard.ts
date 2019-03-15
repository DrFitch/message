import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/core/models/user';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  user: User;

  constructor(private authSvc: AuthenticationService, private router: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.authSvc.subjectUser$.subscribe(res => {
      this.user = res;
    });
    if (!this.user) {
      console.log('Not in my car');
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }
}
