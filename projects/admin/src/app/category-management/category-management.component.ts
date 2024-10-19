import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CurrencyPipe, NgFor, NgIf,CommonModule } from '@angular/common';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';

import { Toast, ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';



@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, CurrencyPipe, RouterModule,CommonModule,ToastModule,ButtonModule ],
  // animations: [
  //   trigger('toastAnimation', [
  //     state('void', style({ opacity: 0 })),
  //     state('*', style({ opacity: 1 })),
  //     transition(':enter', [
  //       animate('0.5s ease-in')
  //     ]),
  //     transition(':leave', [
  //       animate('0.5s ease-out', style({ opacity: 0 }))
  //     ])
  //   ])
  // ]
})
export class CategoryManagementComponent implements OnInit {
  @ViewChild('toast') toast!: Toast; // Reference to Toast
  @ViewChild('deleteCategoryModal') deleteCategoryModal!: ElementRef;
  isDeleteModalOpen:boolean=false;
  categories: Category[] = [];
  searchTerm: string = '';
  addCategoryForm: FormGroup; // Form for adding new category
  updateCategoryForm: FormGroup;
  deleteCategoryForm: FormGroup; // Form for updating category
  newCategoryId: string = ''; // New category ID
  searchMessage: string = ''; // Search message
  selectedCategory: Category | null = null; // Selected category for update

  // @ViewChild('addCategoryModal') addCategoryModal!: ElementRef;

  constructor(private categoryService: CategoryService, private fb: FormBuilder,private messageService: MessageService) {
    // FormBuilder to group form controls
    this.addCategoryForm = this.fb.group({
      categoryName: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.updateCategoryForm = this.fb.group({
      categoryName: ['', Validators.required],
      description: ['', Validators.required]
    });

  
    this.deleteCategoryForm = this.fb.group({
      categoryID: ['', Validators.required]  // Form chỉ để giữ categoryID
    });
    
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  // Generate new category ID
  generateNewCategoryId(): void {
    const maxId = this.categories
      .map(category => category.categoryID)
      .filter(id => id.startsWith('CT'))
      .sort()
      .pop() || 'CT000'; // If no ID, start from CT000

    const newIdNumber = parseInt(maxId.substring(2)) + 1; // Increment the ID
    this.newCategoryId = `CT${newIdNumber.toString().padStart(3, '0')}`; // Format new ID
  }

  openformAdd():void{
const modal=document.getElementById("addCategoryModal");
if(modal!=null){
modal.style.display="block";
}

  }

  // Add new category
  onSubmit(): void {
    if (this.addCategoryForm.valid) {
      const newCategory: Category = {
        categoryID: this.newCategoryId, // Sử dụng ID mới
        ...this.addCategoryForm.value
      };
  
      // Kiểm tra xem tên danh mục có trùng không
      const isDuplicateName = this.categories.some(category => category.categoryName.toLowerCase() === newCategory.categoryName.toLowerCase());
  
      if (isDuplicateName) {
        this.showWarringAdd()
        // Thông báo lỗi nếu tên bị trùng
        // this.toastService.showToast('Tên danh mục đã tồn tại!', 'error');
       // Gán lỗi trùng lặp cho FormControl
      } else {
        // Thêm danh mục mới nếu không trùng
        this.categoryService.addCategory(newCategory).subscribe(() => {
          this.loadCategories(); // Tải lại danh sách danh mục
          this.addCategoryForm.reset();
          this.showSuccessAdd();
         
          // this.toastService.showToast('Category added successfully!', 'success');// Reset form sau khi thêm mới
        }, error => {
          this.showErrorAdd();
          console.error('Xảy ra lỗi khi thêm danh mục', error);
        });
      }
    } else {
      this.showErrorAdd();
      console.error('Biểu mẫu không hợp lệ!');
    }
  }
  

  CloseFormAdd():void{
    const modal=document.getElementById("addCategoryModal");
    if(modal!=null){
    modal.style.display="none";

  }}
  // Load all categories
  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (data: Category[]) => {
        this.categories = data;
        this.generateNewCategoryId(); // Generate new ID after loading categories
      },
      (error) => console.error('Error loading categories', error)
    );
  }

  // Search category by search term
  searchCategory(searchTerm: string): void {
    if (!searchTerm.trim()) { // If search term is empty, reload categories
      this.loadCategories();
    } else {
      this.categoryService.searchCategories(searchTerm).subscribe(
        (data: Category[]) => this.categories = data,
        (error) => console.error('Error searching category', error)
      );
    }
  }

  // Set category to update
  setCategoryToUpdate(category: Category): void {
    this.selectedCategory = category;
    this.updateCategoryForm.patchValue({
      categoryName: category.categoryName,
      description: category.description
    }
  
  );
  
  const modal=document.getElementById("updateCategoryModal");
  if(modal!=null){
    modal.style.display="block";
  
    }
  }
  // Update category
  onUpdate(): void {
    if (this.selectedCategory && this.updateCategoryForm.valid) {
      const updatedCategory: Category = {
        categoryID: this.selectedCategory.categoryID,
        ...this.updateCategoryForm.value
      };

      this.categoryService.updateCategory(updatedCategory).subscribe(() => {
        this.loadCategories(); // Reload categories
        this.selectedCategory = null;
        this.showSuccessUpdate();
         // Clear selection after update
      }, error => {
        console.error('Error updating category', error);
      });
    }
  }
  CloseFormUpdate():void{
    const modal=document.getElementById("updateCategoryModal");
    if(modal!=null){
      modal.style.display="none";
    
      }
  }

  LoadDataUpdate():void{
    const modal=document.getElementById("updateCategoryModal");
    if(modal!=null){
      modal.style.display="none";
      this.loadCategories();
     
    }
  }
  
  // Set the category to be deleted and open the delete confirmation modal
  setCategoryToDelete(category: Category): void {
   
    const modal=document.getElementById("deleteCategoryModal");
    if(modal!=null){
      this.selectedCategory = category;
      modal.style.display="block"
     
    }
  }

  
  // Close the delete confirmation modal
LoadFormDelete(): void{
  const modal=document.getElementById("deleteCategoryModal");
    if(modal!=null){
      modal.style.display="none";
       this.categories = this.categories.filter(category => category.categoryID !== this.selectedCategory?.categoryID);
     
    }

}


CloseFormDelete(){
  const modal=document.getElementById("deleteCategoryModal");
  if(modal!=null){
    modal.style.display="none";
  }
}

  // Confirm and delete the selected category
  // Xử lý xóa danh mục ở phía client
onDelete(): void {
  if (this.selectedCategory) {
    this.categoryService.deleteCategory(this.selectedCategory.categoryID).subscribe(
      () => {
        this.categories = this.categories.filter(category => category.categoryID !== this.selectedCategory?.categoryID);
       
       // Đóng modal sau khi xóa
      },
      error => {
        console.error('Error deleting category', error);
      }
    );
  }
}

//Message Add
showSuccessAdd() {
  this.messageService.add({ severity: 'success', summary: 'Thành Công', detail: 'Thêm danh mục thành công!' });
}
showWarringAdd() {
  this.messageService.add({ severity: 'warning', summary: 'Cảnh Báo', detail: 'Tên danh mục đã tồn tại!' });
}
showErrorAdd() {
  this.messageService.add({ severity: 'danger', summary: 'Lỗi Xảy Ra', detail: 'Thêm danh mục thất bại!' });
}
//Message Update
showSuccessUpdate() {
  this.messageService.add({ severity: 'success', summary: 'Thành Công', detail: 'Cập nhật danh mục thành công!' });
}
showWarringUpdate() {
  this.messageService.add({ severity: 'warning', summary: 'Cảnh Báo', detail: 'Tên danh mục đã tồn tại!' });
}
showErrorUpdate() {
  this.messageService.add({ severity: 'danger', summary: 'Lỗi Xảy Ra', detail: 'Cập nhật danh mục thất bại!' });
}
  
} 