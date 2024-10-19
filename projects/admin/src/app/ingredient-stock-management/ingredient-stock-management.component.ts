import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CurrencyPipe, NgFor, NgIf, CommonModule } from '@angular/common';
import { IngredientStockService } from '../services/ingredientStock.service'; // Import your IngredientStockService
import { IngredientStock } from '../models/ingredientStock .model'; // Import your IngredientStock model
import { Toast, ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-ingredient-stock-management',
  templateUrl: './ingredient-stock-management.component.html',
  styleUrls: ['./ingredient-stock-management.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, CurrencyPipe, RouterModule, CommonModule, ToastModule, ButtonModule]
})
export class IngredientStockManagementComponent implements OnInit {
  @ViewChild('toast') toast!: Toast;
  @ViewChild('deleteIngredientStockModal') deleteIngredientStockModal!: ElementRef;
  isDeleteModalOpen: boolean = false;
  ingredientStocks: IngredientStock[] = [];
  searchTerm: string = '';
  addStockForm: FormGroup; // Form for adding new ingredient stock
  updateStockForm: FormGroup;
  deleteStockForm: FormGroup;
  selectedStock: IngredientStock | null = null; // Selected ingredient stock for update

  constructor(
    private ingredientStockService: IngredientStockService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    // FormBuilder to group form controls
    this.addStockForm = this.fb.group({
      ingredientID: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      stockDate: ['', Validators.required]
    });

    this.updateStockForm = this.fb.group({
      ingredientID: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      stockDate: ['', Validators.required]
    });

    this.deleteStockForm = this.fb.group({
      stockID: ['', Validators.required] // Form only to hold stockID
    });
  }

  ngOnInit(): void {
    this.loadIngredientStocks();
  }

  // Load all ingredient stocks
  loadIngredientStocks(): void {
    this.ingredientStockService.getAllIngredientStocks().subscribe(
      (data: IngredientStock[]) => {
        this.ingredientStocks = data;
      },
      (error) => console.error('Error loading ingredient stocks', error)
    );
  }

  // Open form to add ingredient stock
  openFormAdd(): void {
    this.addStockForm.reset();
    const modal = document.getElementById("addIngredientStockModal");
    if (modal != null) {
      modal.style.display = "block";
    }
  }

  // Add new ingredient stock
  onSubmit(): void {
    if (this.addStockForm.valid) {
      const newStock: IngredientStock = this.addStockForm.value;

      this.ingredientStockService.addIngredientStock(newStock).subscribe(() => {
        this.loadIngredientStocks(); // Reload ingredient stock list
        this.addStockForm.reset(); // Reset form
        this.showSuccessAdd();
      }, error => {
        console.error('Error adding ingredient stock', error);
        this.showErrorAdd();
      });
    } else {
      this.showErrorAdd();
      console.error('Form is invalid!');
    }
  }

  CloseFormAdd(): void {
    const modal = document.getElementById("addIngredientStockModal");
    if (modal != null) {
      modal.style.display = "none";
    }
  }

  // Set ingredient stock to update
  setStockToUpdate(stock: IngredientStock): void {
    this.selectedStock = stock;
    this.updateStockForm.patchValue(stock);

    const modal = document.getElementById("updateIngredientStockModal");
    if (modal != null) {
      modal.style.display = "block";
    }
  }

  // Update ingredient stock
  onUpdate(): void {
    if (this.selectedStock && this.updateStockForm.valid) {
      const updatedStock: IngredientStock = {
        stockID: this.selectedStock.stockID,
        ...this.updateStockForm.value
      };

      this.ingredientStockService.updateIngredientStock(updatedStock).subscribe(() => {
        this.loadIngredientStocks(); // Reload ingredient stocks
        this.selectedStock = null; // Clear selection
        this.showSuccessUpdate();
      }, error => {
        console.error('Error updating ingredient stock', error);
        this.showErrorUpdate();
      });
    }
  }

  CloseFormUpdate(): void {
    const modal = document.getElementById("updateIngredientStockModal");
    if (modal != null) {
      modal.style.display = "none";
    }
  }

  // Set the ingredient stock to be deleted and open the delete confirmation modal
  setStockToDelete(stock: IngredientStock): void {
    this.selectedStock = stock;

    const modal = document.getElementById("deleteIngredientStockModal");
    if (modal != null) {
      modal.style.display = "block";
    }
  }

  // Confirm and delete the selected ingredient stock
  onDelete(): void {
    if (this.selectedStock) {
      this.ingredientStockService.deleteIngredientStock(this.selectedStock.stockID).subscribe(
        () => {
          this.ingredientStocks = this.ingredientStocks.filter(stock => stock.stockID !== this.selectedStock?.stockID);
          this.showSuccessDelete();
        },
        error => {
          console.error('Error deleting ingredient stock', error);
        }
      );
    }
  }

  // Close delete modal
  CloseFormDelete(): void {
    const modal = document.getElementById("deleteIngredientStockModal");
    if (modal != null) {
      modal.style.display = "none";
    }
  }

  // Search ingredient stock by search term
  searchIngredientStock(searchTerm: string): void {
    if (!searchTerm.trim()) { // If search term is empty, reload ingredient stocks
      this.loadIngredientStocks();
    } else {
      this.ingredientStockService.searchIngredientStocks(searchTerm).subscribe(
        (data: IngredientStock[]) => this.ingredientStocks = data,
        (error) => console.error('Error searching ingredient stock', error)
      );
    }
  }

  // Message Add
  showSuccessAdd() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ingredient stock added successfully!' });
  }
  showErrorAdd() {
    this.messageService.add({ severity: 'danger', summary: 'Error Occurred', detail: 'Failed to add ingredient stock!' });
  }

  // Message Update
  showSuccessUpdate() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ingredient stock updated successfully!' });
  }
  showErrorUpdate() {
    this.messageService.add({ severity: 'danger', summary: 'Error Occurred', detail: 'Failed to update ingredient stock!' });
  }

  // Message Delete
  showSuccessDelete() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ingredient stock deleted successfully!' });
  }
}
