import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CurrencyPipe, NgFor, NgIf, CommonModule } from '@angular/common';
import { IngredientService } from '../services/ingredient.service'; // Import your IngredientService
import { Ingredient } from '../models/ingredient .model'; // Import your Ingredient model

import { Toast, ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-ingredient-management',
  templateUrl: './ingredient-management.component.html',
  styleUrls: ['./ingredient-management.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, CurrencyPipe, RouterModule, CommonModule, ToastModule, ButtonModule]
})
export class IngredientManagementComponent implements OnInit {
  @ViewChild('toast') toast!: Toast;
  @ViewChild('deleteIngredientModal') deleteIngredientModal!: ElementRef;
  isDeleteModalOpen: boolean = false;
  ingredients: Ingredient[] = [];
  searchTerm: string = '';
  addIngredientForm: FormGroup; // Form for adding new ingredient
  updateIngredientForm: FormGroup;
  deleteIngredientForm: FormGroup;
  newIngredientId: string = ''; // New ingredient ID
  selectedIngredient: Ingredient | null = null; // Selected ingredient for update

  constructor(
    private ingredientService: IngredientService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    // FormBuilder to group form controls
    this.addIngredientForm = this.fb.group({
      ingredientName: ['', Validators.required],
      supplierID: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]]
    });

    this.updateIngredientForm = this.fb.group({
      ingredientName: ['', Validators.required],
      supplierID: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]]
    });

    this.deleteIngredientForm = this.fb.group({
      ingredientID: ['', Validators.required] // Form chỉ để giữ ingredientID
    });
  }

  ngOnInit(): void {
    this.loadIngredients();
  }

  // // Generate new ingredient ID
  // generateNewIngredientId(): void {
  //   const maxId = this.ingredients
  //     .map(ingredient => ingredient.ingredientID)
  //     .sort()
  //     .pop() || 0; // If no ID, start from 0

  //   this.newIngredientId = maxId + 1; // Increment the ID
  // }

  // Open form to add ingredient
  openFormAdd(): void {
    const modal = document.getElementById("addIngredientModal");
    if (modal != null) {
      modal.style.display = "block";
      // this.generateNewIngredientId(); // Generate new ID
    }
  }

  // Add new ingredient
  onSubmit(): void {
    if (this.addIngredientForm.valid) {
      const newIngredient: Ingredient = {
        ingredientID: this.newIngredientId, // Use new ID
        ...this.addIngredientForm.value
      };

      const isDuplicateName = this.ingredients.some(ingredient => ingredient.ingredientName.toLowerCase() === newIngredient.ingredientName.toLowerCase());

      if (isDuplicateName) {
        this.showWarringAdd(); // Show warning if name already exists
      } else {
        this.ingredientService.addIngredient(newIngredient).subscribe(() => {
          this.loadIngredients(); // Reload ingredient list
          this.addIngredientForm.reset(); // Reset form
          this.showSuccessAdd();
        }, error => {
          this.showErrorAdd();
          console.error('Error adding ingredient', error);
        });
      }
    } else {
      this.showErrorAdd();
      console.error('Form is invalid!');
    }
  }

  CloseFormAdd(): void {
    const modal = document.getElementById("addIngredientModal");
    if (modal != null) {
      modal.style.display = "none";
    }
  }

  // Load all ingredients
  loadIngredients(): void {
    this.ingredientService.getAllIngredients().subscribe(
      (data: Ingredient[]) => {
        this.ingredients = data;
        // this.generateNewIngredientId(); // Generate new ID after loading ingredients
      },
      (error) => console.error('Error loading ingredients', error)
    );
  }

  // Search ingredient by search term
  searchIngredient(searchTerm: string): void {
    if (!searchTerm.trim()) { // If search term is empty, reload ingredients
      this.loadIngredients();
    } else {
      this.ingredientService.searchIngredients(searchTerm).subscribe(
        (data: Ingredient[]) => this.ingredients = data,
        (error) => console.error('Error searching ingredient', error)
      );
    }
  }

  // Set ingredient to update
  setIngredientToUpdate(ingredient: Ingredient): void {
    this.selectedIngredient = ingredient;
    this.updateIngredientForm.patchValue({
      ingredientName: ingredient.ingredientName,
      supplierID: ingredient.supplierID,
      price: ingredient.price
    });

    const modal = document.getElementById("updateIngredientModal");
    if (modal != null) {
      modal.style.display = "block";
    }
  }

  // Update ingredient
  onUpdate(): void {
    if (this.selectedIngredient && this.updateIngredientForm.valid) {
      const updatedIngredient: Ingredient = {
        ingredientID: this.selectedIngredient.ingredientID,
        ...this.updateIngredientForm.value
      };

      this.ingredientService.updateIngredient(updatedIngredient).subscribe(() => {
        this.loadIngredients(); // Reload ingredients
        this.selectedIngredient = null; // Clear selection
        this.showSuccessUpdate();
      }, error => {
        console.error('Error updating ingredient', error);
      });
    }
  }

  CloseFormUpdate(): void {
    const modal = document.getElementById("updateIngredientModal");
    if (modal != null) {
      modal.style.display = "none";
    }
  }

  // Set the ingredient to be deleted and open the delete confirmation modal
  setIngredientToDelete(ingredient: Ingredient): void {
    this.selectedIngredient = ingredient;

    const modal = document.getElementById("deleteIngredientModal");
    if (modal != null) {
      modal.style.display = "block";
    }
  }

  // Confirm and delete the selected ingredient
  onDelete(): void {
    if (this.selectedIngredient) {
      this.ingredientService.deleteIngredient(this.selectedIngredient.ingredientID).subscribe(
        () => {
          this.ingredients = this.ingredients.filter(ingredient => ingredient.ingredientID !== this.selectedIngredient?.ingredientID);
          this.showSuccessDelete();
        },
        error => {
          console.error('Error deleting ingredient', error);
        }
      );
    }
  }

  // Close delete modal
  CloseFormDelete(): void {
    const modal = document.getElementById("deleteIngredientModal");
    if (modal != null) {
      modal.style.display = "none";
    }
  }

  // Message Add
  showSuccessAdd() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ingredient added successfully!' });
  }
  showWarringAdd() {
    this.messageService.add({ severity: 'warning', summary: 'Warning', detail: 'Ingredient name already exists!' });
  }
  showErrorAdd() {
    this.messageService.add({ severity: 'danger', summary: 'Error Occurred', detail: 'Failed to add ingredient!' });
  }

  // Message Update
  showSuccessUpdate() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ingredient updated successfully!' });
  }
  showErrorUpdate() {
    this.messageService.add({ severity: 'danger', summary: 'Error Occurred', detail: 'Failed to update ingredient!' });
  }

  // Message Delete
  showSuccessDelete() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ingredient deleted successfully!' });
  }
}
