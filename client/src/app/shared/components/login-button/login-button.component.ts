import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.scss'],
})
export class LoginButtonComponent implements OnInit, OnDestroy {
  state = 'normal';
  size = 'small';

  srcSmall = {
    normal:
      '/assets/img/google-login/button-small/btn_google_signin_dark_normal_web.png',
    focus:
      '/assets/img/google-login/button-small/btn_google_signin_dark_focus_web.png',
    pressed:
      '/assets/img/google-login/button-small/btn_google_signin_dark_pressed_web.png',
    disabled:
      '/assets/img/google-login/button-small/btn_google_signin_dark_disabled_web.png',
  };

  srcBig = {
    normal:
      '/assets/img/google-login/button-big/btn_google_signin_dark_normal_web@2x.png',
    focus:
      '/assets/img/google-login/button-big/btn_google_signin_dark_focus_web@2x.png',
    pressed:
      '/assets/img/google-login/button-big/btn_google_signin_dark_pressed_web@2x.png',
    disabled:
      '/assets/img/google-login/button-big/btn_google_signin_dark_disabled_web@2x.png',
  };

  subscriptions: Subscription[] = [];

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    const resizeSub = fromEvent(window, 'resize')
      .pipe(map((e) => (e.target as Window).innerWidth))
      .subscribe(this.onResize.bind(this));
    this.subscriptions.push(resizeSub);
    this.onResize(window.innerWidth);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  changeState(newState: string) {
    this.state = newState;
  }

  onResize(windowWidth: number) {
    const newSize = windowWidth > 768 ? 'big' : 'small';
    if (this.size !== newSize) {
      this.size = newSize;
      this.changeDetectorRef.detectChanges();
    }
  }
}
