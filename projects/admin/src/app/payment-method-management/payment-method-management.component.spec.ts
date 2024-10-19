import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodManagementComponent } from './payment-method-management.component';

describe('PaymentMethodManagementComponent', () => {
  let component: PaymentMethodManagementComponent;
  let fixture: ComponentFixture<PaymentMethodManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentMethodManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentMethodManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
