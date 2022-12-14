import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../../../core/services';

interface SignInForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInComponent implements OnInit {
  continueUrl: string;
  isSigningIn: boolean = false;
  signInForm: FormGroup<SignInForm>;

  constructor(private ref: ChangeDetectorRef, private route: ActivatedRoute, private router: Router, private authService: AuthService) {
    this.signInForm = new FormGroup<SignInForm>({
      email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(128)] })
    });
    this.continueUrl = this.route.snapshot.queryParams['continue'] || '/';
  }

  ngOnInit(): void {

  }

  onSignInFormSubmit() {
    if (this.signInForm.invalid)
      return;
    this.isSigningIn = true;
    this.authService.signIn(this.signInForm.getRawValue()).subscribe(() => this.router.navigate([this.continueUrl])).add(() => {
      this.isSigningIn = false;
      this.ref.markForCheck();
    });
  }

}
