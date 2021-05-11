import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { Subject } from 'rxjs';
import { CreditCardPaymentFacade } from '../store/facade';
import { currentDate } from '../store/reducer';
import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-card-payment',
  templateUrl: './card-payment.component.html',
  styleUrls: ['./card-payment.component.scss']
})
export class CardPaymentComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();

  paymentForm: FormGroup;
  errorMessage: string;
  currentDate = new Date();
  currentMonth = currentDate.getMonth() + 1;
  currentYear = currentDate.getFullYear();

  constructor(private formBuilder: FormBuilder, private facade: CreditCardPaymentFacade,private paymentService:PaymentService,private toasterService:ToasterService ) { }

  ngOnInit() {
    this.errorMessage = "Please Fill all fields";
    this.buildForm();
  }


  buildForm() {
    this.paymentForm = this.formBuilder.group({
      FirstName: ['', [Validators.required, Validators.pattern('^[A-Za-z][A-Za-z -]*$')]],
      LastName: ['', [Validators.required,Validators.minLength(1),Validators.pattern('^[A-Za-z][A-Za-z -]*$')]],
      Email: ['', [Validators.required,Validators.minLength(16),Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{3}$')]],
      Budget: ['', [Validators.required,Validators.minLength(1),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      PhoneNumber: ['', [Validators.required,Validators.minLength(10),Validators.pattern('^[6-9][0-9]{9}$')]]
    });
  }

 // convenience getter for easy access to form fields
 get formControls() { return this.paymentForm.controls; }

 onSubmit() {
   this.submitForm();
  }

  submitForm() {
  if (this.paymentForm.status === 'VALID') {
    const paymentFormData = {
      FirstName: this.paymentForm.get('FirstName').value,
      LastName: this.paymentForm.get('LastName').value,
      Email: this.paymentForm.get('Email').value,
      Budget: this.paymentForm.get('Budget').value,
      PhoneNumber: +this.paymentForm.get('PhoneNumber').value,
    };

    this.facade.makePayment(paymentFormData);
   
  } else {
    this.errorMessage = "the Form is Invalid!";
  }
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
