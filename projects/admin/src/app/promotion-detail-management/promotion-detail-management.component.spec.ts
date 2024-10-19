import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionDetailManagementComponent } from './promotion-detail-management.component';

describe('PromotionDetailManagementComponent', () => {
  let component: PromotionDetailManagementComponent;
  let fixture: ComponentFixture<PromotionDetailManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionDetailManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionDetailManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
