import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartDetailManagementComponent } from './cart-detail-management.component';

describe('CartDetailManagementComponent', () => {
  let component: CartDetailManagementComponent;
  let fixture: ComponentFixture<CartDetailManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartDetailManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartDetailManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
