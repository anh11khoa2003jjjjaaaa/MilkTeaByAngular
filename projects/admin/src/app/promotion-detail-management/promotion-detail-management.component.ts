import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PromotionService } from '../services/promotion.service'; // Service for handling promotions
import { ActivatedRoute } from '@angular/router'; // For getting the ID from URL
import { MessageService } from 'primeng/api'; // For displaying messages
import { NgFor, NgIf } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { PromotionDetail } from '../models/promotionDetail .model';
import { PromotionDetailtionService } from '../services/promotionDetail.service';

@Component({
  selector: 'app-promotion-detail-management',
  templateUrl: './promotion-detail-management.component.html',
  styleUrls: ['./promotion-detail-management.component.css'],
  providers: [MessageService],
  standalone:true,
  imports:[NgIf,NgFor,ReactiveFormsModule,ToastModule,ButtonModule]
})
export class PromotionDetailComponent implements OnInit {
  promotionDetails: PromotionDetail[] = []; // List of promotion details (products in promotion)
  promotionID: string | null = null; // ID of the promotion from URL
  selectedDetail: any | null = null; // Detail selected for update or delete
;
  promotionToUpdate: any = null;
  // Forms for adding, updating, and deleting promotion details
  addPromotionDetailForm!: FormGroup;
  updatePromotionDetailForm!: FormGroup;
  deletePromotionDetailForm!: FormGroup;
  lastPromotionDetailID: number = 1;

  constructor(
    private promotiondetailService: PromotionDetailtionService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    // Initialize forms
    this.addPromotionDetailForm = this.fb.group({
      promotionName: [{ value: '', disabled: true }, Validators.required],
    productID: ['', Validators.required],    // Add this control
    productName: [{ value: '', disabled: true }, Validators.required],
    promotionID: ['', Validators.required]    // Add this control if needed
    });

    this.updatePromotionDetailForm = this.fb.group({
      promotionName: ['', Validators.required],
      productName: ['', Validators.required],
    });

    this.deletePromotionDetailForm = this.fb.group({
      promotionDetailID: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Get promotion ID from the URL
    this.getAllPromotions();
    console.log(this.promotionDetails)
  }


  getAllPromotions(): void {
    this.promotiondetailService.getAllPromotionDetailsWithNames().subscribe({
      next: (data) => {
        this.promotionDetails = data;
        this.lastPromotionDetailID = Math.max(...this.promotionDetails.map(p => parseInt(p.promotionID.replace('PROM', ''))), 0); // Calculate last ID from existing promotions // Store promotions in the array
      },
      error: () => this.showErrorMessage('Error fetching promotions') // Handle error
    });
  }
  // Fetch promotion details (products in promotion)
  // getPromotionDetails(promotionID: string): void {
  //   this.promotionService.getPromotionById(promotionID).subscribe({
  //     next: (data) => {
  //       this.promotionDetails = data; // Assign data to promotionDetails
  //     },
  //     error: () => this.showErrorMessage('Error fetching promotion details'),
  //   });
  // }

  openFormAddPromotionDetail(): void {
    this.promotionToUpdate = null; // Reset any previous promotion details if any
    const modal = document.getElementById('addPromotionDetailModal');
    if (modal) {
      modal.style.display = 'block'; // Show the modal
    }
  }

  // Add new promotion detail (product)
  addPromotionDetail(): void {
    if (this.addPromotionDetailForm.valid) {
      const promotionDetail = this.addPromotionDetailForm.value;
      // Handle the logic to add the promotion detail, e.g., API call
      console.log('Adding promotion detail:', promotionDetail);

      // After submission, you can close the modal or reset the form
      this.closeFormAddPromotionDetail();
    }
  }
  // Update selected promotion detail
  onUpdatePromotionDetail(): void {
    if (this.updatePromotionDetailForm.valid && this.selectedDetail) {
      const updatedDetail = this.updatePromotionDetailForm.value;
      this.promotiondetailService.updatePromotion(this.selectedDetail.promotionID, updatedDetail).subscribe({
        next: () => {
          this.showSuccessMessage('Promotion detail updated successfully');
    // Reload after updating
          this.closeFormUpdatePromotionDetail(); // Close modal
        },
        error: () => this.showErrorMessage('Error updating promotion detail'),
      });
    }
  }

  // Delete selected promotion detail
  onDeletePromotionDetail(): void {
    if (this.selectedDetail) {
      this.promotiondetailService.deletePromotion(this.selectedDetail.promotionID).subscribe({
        next: () => {
          this.showSuccessMessage('Promotion detail deleted successfully');
      // Reload after deleting
          this.closeFormDeletePromotionDetail(); // Close modal
        },
        error: () => this.showErrorMessage('Error deleting promotion detail'),
      });
    }
  }

  // Set detail to be updated
  setDetailToUpdate(detail: any): void {
    this.selectedDetail = detail;
    this.updatePromotionDetailForm.patchValue({
      promotionName: detail.promotionName,
      productID: detail.productID,
      productName: detail.productName,
    });
  }

  // Set detail to be deleted
  setDetailToDelete(detail: any): void {
    this.selectedDetail = detail;
    this.deletePromotionDetailForm.patchValue({
      promotionID: detail.promotionID,
    });
  }

  // Show success message
  showSuccessMessage(message: string): void {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  // Show error message
  showErrorMessage(message: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  // Close modal for adding promotion detail
  closeFormAddPromotionDetail(): void {
    // Close modal logic
  }

  // Close modal for updating promotion detail
  closeFormUpdatePromotionDetail(): void {
    // Close modal logic
  }

  // Close modal for deleting promotion detail
  closeFormDeletePromotionDetail(): void {
    // Close modal logic
  }

  // Search promotion details (e.g., by product name)
  // searchPromotionDetail(searchTerm: string): void {
  //   if (searchTerm) {
  //     this.promotiondetailService.getPromotionById(this.promotionID!, searchTerm).subscribe({
  //       next: (results) => {
  //         this.promotionDetails = results;
  //       },
  //       error: () => this.showErrorMessage('Error searching promotion details'),
  //     });
  //   }
  // }
}
