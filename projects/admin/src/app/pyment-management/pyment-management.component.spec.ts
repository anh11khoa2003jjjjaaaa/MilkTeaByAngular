import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PymentManagementComponent } from './pyment-management.component';

describe('PymentManagementComponent', () => {
  let component: PymentManagementComponent;
  let fixture: ComponentFixture<PymentManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PymentManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PymentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
