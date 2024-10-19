import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api'; // To display messages
import { PromotionService } from '../services/promotion.service'; // Service for promotions
import { Promotion } from '../models/promotion.model'; // Promotion model
import { CommonModule, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { start } from 'repl';
import { error } from 'console';

@Component({
  selector: 'app-promotion-management',
  templateUrl: './promotion-management.component.html',
  styleUrls: ['./promotion-management.component.css'],
  standalone: true,
  providers: [MessageService],
  imports: [NgFor, NgIf, ReactiveFormsModule, CurrencyPipe, RouterModule,CommonModule,ToastModule,ButtonModule ],
})
export class PromotionManagementComponent implements OnInit {

  promotions: Promotion[] = []; // List of promotions
  promotionToUpdate: Promotion | null = null; // Selected promotion for update
  promotionToDelete: Promotion | null = null; // Selected promotion for deletion
  selectedPromotion: Promotion | null = null;
  lastPromotionID: number = 1;

  addPromotionForm!: FormGroup; // Form for adding new category
  updatePromotionForm!: FormGroup;
  deletePromotionForm!: FormGroup; 
  constructor(private promotionService: PromotionService, private messageService: MessageService,private fb: FormBuilder) {
    this.updatePromotionForm = this.fb.group({
      promotionName: ['', Validators.required],
      discountPercentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

    this.addPromotionForm = this.fb.group({

      promotionName: ['', Validators.required],
      discountPercentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

    this.deletePromotionForm = this.fb.group({
      promotionID: ['', Validators.required]

    });
  }

  ngOnInit(): void {


    this.getAllPromotions(); // Load promotions on initialization
  }

  // Fetch all promotions
  getAllPromotions(): void {
    this.promotionService.getAllPromotions().subscribe({
      next: (data) => {
        this.promotions = data;
        this.lastPromotionID = Math.max(...this.promotions.map(p => parseInt(p.promotionID.replace('PROM', ''))), 0); // Calculate last ID from existing promotions // Store promotions in the array
      },
      error: () => this.showErrorMessage('Error fetching promotions') // Handle error
    });
  }
  generatePromotionID(): string {
    this.lastPromotionID++; // Increase the last ID
    return `PROM${this.lastPromotionID.toString().padStart(3, '0')}`; // Format to PROM001, PROM002, ...
  }

  // Search promotions by term
  searchPromotion(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.showErrorMessage('Please enter a search term');
      return;
    }
    this.promotionService.searchPromotions(searchTerm).subscribe({
      next: (data) => this.promotions = data,
      error: () => this.showErrorMessage('Error searching promotions') // Handle search error
    });
  }

  // Open the form to add a new promotion
  openFormAddPromotion(): void {
    this.promotionToUpdate = null; // Reset the form for adding
    const modal = document.getElementById("addPromotionModal");
    if (modal) {
      modal.style.display = "block"; // Display the form modal
    }
  }

  // Close the add promotion form
  closeFormAddPromotion(): void {
    const modal = document.getElementById("addPromotionModal");
    if (modal) {
      modal.style.display = "none"; // Hide the form modal
    }
  }


  setPromotionToUpdate(promotion: Promotion): void {
    this.selectedPromotion = promotion;
  
    // Gán giá trị của khuyến mãi được chọn vào form
    this.updatePromotionForm.patchValue({
      promotionName: promotion.promotionName,
      discount: promotion.discountPercentage,
      startDate:promotion.startDate,
      endDate: promotion.endDate
    });
  
    // Hiển thị modal cập nhật khuyến mãi
    const modal = document.getElementById("updatePromotionModal");
    if (modal != null) {
      modal.style.display = "block";
    }
  }
  onUpdatePromotion(): void {
    if (this.selectedPromotion && this.updatePromotionForm.valid) {
      const updatedPromotion: Promotion = {
        promotionID: this.selectedPromotion.promotionID,
        ...this.updatePromotionForm.value // Lấy các giá trị từ form
      };

      this.promotionService.updatePromotion(updatedPromotion).subscribe(() => {
        this.getAllPromotions(); // Tải lại danh sách khuyến mãi sau khi cập nhật
        this.selectedPromotion = null; // Xóa lựa chọn khuyến mãi
        this.updatePromotionForm.reset(); // Đặt lại form
        this.closeFormUpdatePromotion(); // Đóng modal
      }, error => {
        console.error('Error updating promotion', error);
      });
    }
  }


  // Close the update promotion form
  closeFormUpdatePromotion(): void {
    const modal = document.getElementById("updatePromotionModal");
    if (modal) {
      modal.style.display = "none"; // Hide the update form
    }
  }

 
  // Handle adding a promotion
  // Hàm để thêm khuyến mãi mới
  addPromotion(): void {
    if (!this.addPromotionForm.valid) {
      this.showErrorMessage('Please fill out all required fields');
      return;
    }

    const newPromotion: Promotion = {
      
      ...this.addPromotionForm.value,
      promotionID: this.generatePromotionID(),
    }; // Lấy dữ liệu từ form

    this.promotionService.addPromotion(newPromotion).subscribe({
      next: (data) => {
        console.log("Data",data);
        this.promotions.push(data); // Thêm khuyến mãi mới vào danh sách
        this.showSuccessMessage('Promotion added successfully');
        this.addPromotionForm.reset(); // Đặt lại form sau khi thêm
        this.closeFormAddPromotion(); // Đóng form thêm khuyến mãi
      },
      error: () => this.showErrorMessage('Error adding promotion')
    });
  }
 // Open the confirmation modal for deletion
// Hàm để mở modal xóa và chọn promotion để xóa
setPromotionToDelete(promotion: Promotion): void {
  this.selectedPromotion = promotion;
  
  // Cập nhật promotionID vào form
  this.deletePromotionForm.patchValue({
    promotionID: promotion.promotionID
  });

  const modal = document.getElementById("deletePromotionModal");
  if (modal) {
    modal.style.display = "block"; // Hiển thị modal
  }
}

// Hàm để đóng modal
closeFormDeletePromotion(): void {
  const modal = document.getElementById("deletePromotionModal");
  if (modal) {
    modal.style.display = "none";
    this.promotions = this.promotions.filter(promotion => promotion.promotionID !== this.selectedPromotion?.promotionID); // Ẩn modal
  }
 
}
// onDelete(): void {
//   if (this.selectedCategory) {
//     this.categoryService.deleteCategory(this.selectedCategory.categoryID).subscribe(
//       () => {
//         this.categories = this.categories.filter(category => category.categoryID !== this.selectedCategory?.categoryID);
       
//        // Đóng modal sau khi xóa
//       },
//       error => {
//         console.error('Error deleting category', error);
//       }
//     );
//   }
// }

// Hàm xử lý khi gửi form xóa promotion
onDelete() {
  if (this.selectedPromotion) {
    

    this.promotionService.deletePromotion(this.selectedPromotion.promotionID).subscribe(
      () => {
        // Cập nhật danh sách promotion sau khi xóa thành công
        this.promotions = this.promotions.filter(promotion => promotion.promotionID !==this.selectedPromotion?.promotionID);
        this.showSuccessMessage('Khuyến mãi đã được xóa thành công');
      },
      error => {
        console.error('Error deleting category', error);
      }
    );
  }
}

  // Display success message
  showSuccessMessage(message: string): void {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  // Display error message
  showErrorMessage(message: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
}
