import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CurrencyPipe, NgFor, NgIf, CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model'; 
import { Toast, ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
// Quan trong trong việc map
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, CurrencyPipe, RouterModule, CommonModule, ToastModule, ButtonModule],
})
export class ProductListComponent implements OnInit {

  // @ViewChild('toast') toast!: Toast;
  @ViewChild('deleteProductModal') deleteProductModal!: ElementRef;
  isDeleteModalOpen: boolean = false;
  products: Product[] = [];
  categories: Category[] = []; 
  searchTerm: string = ''; 
  addProductForm: FormGroup; 
  updateProductForm: FormGroup;
  deleteProductForm: FormGroup; 
  newProductId: string = ''; 
  selectedProduct: Product | null = null; 
  imageFile: File | null = null;

  
  //Khởi tạo contructor
  constructor( private changeDetectorRef: ChangeDetectorRef,private productService: ProductService, private fb: FormBuilder, private messageService: MessageService, private categoryService: CategoryService ) {
    
    // Định nghĩa các thuộc tính cần thiết trong form ADD
    this.addProductForm = this.fb.group({
      productName: ['', Validators.required],
      categoryID:['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      stock: ['', Validators.required],
      imageURL:['', Validators.required]
    });

    // Định nghĩa các thuộc tính cần thiết trong form UPDATE
    this.updateProductForm = this.fb.group({
      productName: ['', Validators.required],
      categoryID:['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      stock: ['', Validators.required],
      imageURL:['null', Validators.required]
    });
    //Định nghĩa các thuộc tính cần thiết trong form DELETE
    this.deleteProductForm = this.fb.group({
      productID: ['', Validators.required],
     
    });
  }

  //Khởi tạo sau khi chạy ứng dụng
  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    
     // Load products when component initializes
  }

   // Hàm để tải danh mục
   loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (data) => {
        this.categories = data;
       
        console.log(this.categories);
      },
      (error) => {
        console.error('Error loading categories', error);
      }
    );
  }

  // Hàm sinh ProductID tự đông: PRD001
  generateNewProductId(): void {
    const maxId = this.products
      .map(product => product.productID)
      .filter(id => id.startsWith('PRD'))
      .sort()
      .pop() || 'PRD000'; // If no ID exists, start from PR000

    const newIdNumber = parseInt(maxId.substring(3)) + 1; // Increment ID number
    this.newProductId = `PRD${newIdNumber.toString().padStart(3, '0')}`; // Format new ID
  }

  //Hàm để mở form ADD
  openformAdd(): void {
    const modal = document.getElementById('addProductModal');
    if (modal != null) {
      modal.style.display = 'block';
    }
  }
  
   //Hàm để hiện thị hình ảnh
   getImageUrl(imageUrl: string): string {
    return this.productService.getImageUrl(imageUrl ?? '');
  }
// Hàm thực hiện chức năng ADD
// Hàm thực hiện chức năng ADD
onSubmit(): void {
  const imageFile = this.imageFile; // Lấy tệp từ biến đã lưu trong onFileChange

  // Kiểm tra từng trường trong form
  if (!this.addProductForm.valid) {
    console.log('Biểu mẫu không hợp lệ. Vui lòng kiểm tra lại các trường.');
    Object.keys(this.addProductForm.controls).forEach(field => {
      const control = this.addProductForm.get(field);
      if (control?.invalid) {
        console.log(`Trường ${field} không hợp lệ:`, control.errors);
      }
    });
    alert('Biểu mẫu không hợp lệ! Vui lòng kiểm tra lại.');
    return;
  }

  // Kiểm tra xem có file hình ảnh không
  if (!imageFile) {
    alert('Bạn chưa chọn hình ảnh! Vui lòng chọn tệp hình ảnh.');
    console.log('Tệp hình ảnh chưa được chọn');
    return;
  }

  // Kiểm tra kiểu MIME của tệp (chỉ chấp nhận jpg hoặc png)
  if (!(imageFile instanceof File && (imageFile.type === 'image/jpeg' || imageFile.type === 'image/png'))) {
    alert('Chỉ chấp nhận các tệp hình ảnh có định dạng .jpg hoặc .png');
    console.log('Tệp hình ảnh không hợp lệ:', imageFile.type);
    return;
  }

  // Tạo đối tượng sản phẩm mới
  const newProduct: Product = {
    productID: this.newProductId, // ID có thể tự động sinh
    ...this.addProductForm.value,
    imageURL: imageFile.name // Lưu tên tệp hình ảnh
  };

  // Tạo đối tượng FormData để gửi dữ liệu
  const formData = new FormData();
  formData.append('product', new Blob([JSON.stringify(newProduct)], { type: 'application/json' }));
  formData.append('imageFile', imageFile); // Thêm tệp hình ảnh vào FormData

  console.log('Dữ liệu sản phẩm trước khi gửi:', newProduct);

  // Gọi dịch vụ để thêm sản phẩm
  this.productService.addProduct(formData).subscribe({
    next: (response) => {
      this.addProductForm.reset(); // Reset form sau khi thêm thành công
      this.loadProducts(); // Load lại sản phẩm
      this.showSuccessAdd(); // Hiển thị thông báo thành công
    },
    error: (error) => {
      console.error('Lỗi khi thêm sản phẩm', error);
      this.showErrorAdd(); // Hiển thị thông báo lỗi
      console.log('Có lỗi xảy ra khi thêm sản phẩm: ' + (error.error?.message || error.message)); // Hiển thị thông báo lỗi chi tiết
    }
  });
}

// onSubmit(): void {
//   var imageFile = this.imageFile; // Lấy tệp từ biến đã lưu trong onFileChange
//   if (this.addProductForm.valid && imageFile) { // Kiểm tra nếu form hợp lệ và đã có file hình ảnh
//     const newProduct: Product = {
//       productID: this.newProductId, // ID có thể tự động sinh
//       ...this.addProductForm.value,
//       imageURL: imageFile.name // Lưu tên tệp hình ảnh
//     };

//     // Tạo đối tượng FormData để gửi dữ liệu
//     const formData = new FormData();
//     formData.append('product', new Blob([JSON.stringify(newProduct)], { type: 'application/json' }));

//     // Kiểm tra kiểu MIME của tệp
//     if (imageFile instanceof File && (imageFile.type === 'image/jpeg' || imageFile.type === 'image/png')) {
//       formData.append('imageFile', imageFile); // Thêm tệp hình ảnh vào FormData
//       console.log('Dữ liệu sản phẩm trước khi gửi:', newProduct);

//       // Gọi dịch vụ để thêm sản phẩm
//       this.productService.addProduct(formData).subscribe({
//         next: (response) => {
//           this.addProductForm.reset();
          
    
//  // Reset form sau khi thêm thành công
//           this.loadProducts(); // Load lại sản phẩm
//           this.showSuccessAdd();
//         },
//         error: (error) => {
//           console.error('Lỗi khi thêm sản phẩm', error);
//           this.showErrorAdd() // In lỗi ra console
//           console.log('Có lỗi xảy ra khi thêm sản phẩm: ' + (error.error?.message || error.message)); // Hiển thị thông báo lỗi chi tiết
//         }
//       });
//     } else {
//       alert('Chỉ chấp nhận các tệp hình ảnh có định dạng .jpg hoặc .png');
//       return;
//     }
//   } else {
//     alert('Biểu mẫu không hợp lệ hoặc chưa chọn hình ảnh!'); // Thông báo nếu biểu mẫu không hợp lệ hoặc chưa có ảnh
//   }
// }

// // Hàm để thay đổi lựa chọn khi chọn file hình ảnh
onFileChange(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    this.imageFile = file; // Lưu tệp vào biến toàn cục imageFile
    console.log('Selected Image File:', this.imageFile); // Log tệp hình ảnh đã chọn
  }
}
// onFileChange(event: any) {
//   const file = event.target.files[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = () => {
//       this.imagePreview = reader.result;
//     };
//     reader.readAsDataURL(file);
//   }
// }



  //Hàm để đóng form Add
  CloseFormAdd(): void {
    const modal = document.getElementById('addProductModal');
    if (modal != null) {
      modal.style.display = 'none';
    }
  }


  //Hàm để chuyển categoryID trong bảng product sang categoryName
  mapCategoryName(products: Product[]) {
    products.forEach(product => {
      const category = this.categories.find(cat => cat.categoryID === product.categoryID);
      if (category) {
        product.categoryName = category.categoryName; // Gán tên danh mục cho product
      }
    });
  }

  // Hàm thực hiện chức năng load dữ liệu product lên giao diện
loadProducts(): void {
  // Dùng để hiện thị CategoyID thành CategoryName
  forkJoin({
    products: this.productService.getAllProducts(),
    categories: this.categoryService.getAllCategories()
  }).subscribe(
    ({ products, categories }) => {
      this.products = products;
      this.categories = categories;
    

      console.log('Categories:', this.categories); // Kiểm tra danh mục
      console.log('Products:', this.products);     // Kiểm tra sản phẩm

      this.mapCategoryName(this.products);
      console.log('Products with Category Name:', this.products); // Kiểm tra sau khi ánh xạ tên danh mục

      this.generateNewProductId();

      // Sau khi load lại dữ liệu, thêm timestamp để load lại hình ảnh không bị cache
      this.products.forEach(product => {
        product.imageURL = this.getImageUrl(product.imageURL?? '');
      });
    },
    error => console.error('Error loading products', error)
  );
}

  

// Search product by search term
searchProduct(searchTerm: string): void {
  if (!searchTerm.trim()) {
    this.loadProducts(); // Reload products if search term is empty
  } else {
    this.productService.searchProducts(searchTerm).subscribe(
      (response: any) => { // Dữ liệu trả về là đối tượng "response"
        console.log('API Response:', response); // Kiểm tra phản hồi từ API
        
        // Lấy dữ liệu sản phẩm từ đối tượng "success"
        this.products = response.success; 
        this.products.forEach(product => {
          product.imageURL = `http://localhost:8080/IMG/${product.imageURL}`;
          console.log(product.imageURL);
        });
        this.mapCategoryName(this.products); // Gán tên danh mục cho sản phẩm
        
        if (this.products.length === 0) {
          this.messageService.add({severity: 'warn', summary: 'Không tìm thấy', detail: 'Không tìm thấy sản phẩm nào phù hợp'});
        } else {
          this.messageService.add({severity: 'success', summary: 'Đã tìm thấy', detail: 'Sản phẩm đã tìm thấy'});
        }
      },
      error => {
        console.error('Error searching product', error);
        this.messageService.add({severity: 'error', summary: 'Lỗi', detail: 'Có lỗi xảy ra trong quá trình tìm kiếm'});
      }
    );
  }
}

  // Hàm để hiện form UPDATE và gián giá trị lên form 
  setProductToUpdate(product: Product): void {
    this.selectedProduct = product;
    this.updateProductForm.patchValue({
      productName: product.productName,
      price: product.price,
      description: product.description,
      stock: product.stock,
    });

    // Hiển thị modal
    const modal = document.getElementById('updateProductModal');
    if (modal != null) {
      modal.style.display = 'block';
      // Thêm lớp 'show' của Bootstrap để tạo hiệu ứng hiển thị

  
    }
}

  //Hàm thực hiện chức năng UPDATE
  onUpdate(): void {
    if (this.selectedProduct && this.updateProductForm.valid) {
        const updatedProduct: Product = {
            productID: this.selectedProduct.productID,
            ...this.updateProductForm.value
        };
        
        console.log('Updating Product:', updatedProduct);
        console.log('Image File:', this.imageFile);
        // Call the update product service method
        this.productService.updateProduct(updatedProduct, this.imageFile).subscribe({
            next: () => {
                this.loadProducts();
                this.selectedProduct = null;
                this.showSuccessUpdate();
            },
            error: error => {
                this.showErrorUpdate();
                console.error('Error updating product', error);
            }
        });
    }
}

//Hàm có chức năng đóng form Update lại
CloseFormUpdate(): void {
  const modal = document.getElementById('updateProductModal');
  if (modal != null) {
    modal.style.display = 'none';
   // Loại bỏ lớp 'show'

  
  }
}



  //-----------------------------------------------DELETE------------------------------------------------------------

  // Hàm để hiện form Xóa và gán giá trị cho form DELETE
  setProductToDelete(product: Product): void {
    const modal = document.getElementById('deleteProductModal');
    if (modal != null) {
      this.selectedProduct = product;
      modal.style.display = 'block';
    }
  }

  // Hàm có chức năng DELETE
  onDelete(): void {
    if (this.selectedProduct) {
      this.productService.deleteProduct(this.selectedProduct.productID).subscribe(
        () => {
          this.products = this.products.filter(product => product.productID !== this.selectedProduct?.productID);
          this.selectedProduct = null;
          this.showSusscessDelete();
        },
        error => {
          console.error('Error deleting product', error);
        }
      );
    }
  }

  // Hàm có chức năng đóng form DELETE
  CloseFormDelete(): void {
    const modal = document.getElementById('deleteProductModal');
    if (modal != null) {
      modal.style.display = 'none';
    }
  }

  //----------------------------------------------------THÔNG BÁO----------------------------------------------------

  // Hàm để hiện thông báo cho chức năng ADD
  showSuccessAdd() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Thêm sản phẩm thành công!' });
  }
  showWarningAdd() {
    this.messageService.add({ severity: 'warning', summary: 'Warning', detail: 'Tên sản phẩm đã tồn tại!' });
  }
  showErrorAdd() {
    this.messageService.add({ severity: 'danger', summary: 'Error', detail: 'Thêm sản phẩm thất bại!' });
  }
  

  // Hàm để hiện thông báo cho chức năng UPDATE
  showSuccessUpdate() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cập nhật sản phẩm thành công!' });
  }
  showErrorUpdate() {
    this.messageService.add({ severity: 'danger', summary: 'Error', detail: 'Cập nhật sản phẩm thất bại!' });
  }

  //Hàm để hiện thông báo cho chức năng DELETE
  showSusscessDelete() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Xóa sản phẩm thành công' });
  }
}
