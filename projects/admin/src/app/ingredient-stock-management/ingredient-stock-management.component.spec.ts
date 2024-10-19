import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientStockManagementComponent } from './ingredient-stock-management.component';

describe('IngredientStockManagemnentComponent', () => {
  let component: IngredientStockManagementComponent;
  let fixture: ComponentFixture<IngredientStockManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientStockManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientStockManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
