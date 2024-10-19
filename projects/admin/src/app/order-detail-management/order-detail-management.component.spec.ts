import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailManagementComponent } from './order-detail-management.component';

describe('OrderDetailManagementComponent', () => {
  let component: OrderDetailManagementComponent;
  let fixture: ComponentFixture<OrderDetailManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDetailManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDetailManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
