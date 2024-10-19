import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../service/product.service'; // Đường dẫn tới ProductService
import { Product } from '../../../../../admin/src/app/models/product.model'; // Đường dẫn tới model Product
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../service/cart.service'; // Đường dẫn tới CartService
import { AuthService } from '../../auth/auth.service'; // Đường dẫn tới AuthService
import { CartRequest } from '../../../../../admin/src/app/models/cartRequest.model';
import { Cart } from '../../../../../admin/src/app/models/cart.model';
import { CartDetail } from '../../../../../admin/src/app/models/cartDetail.model';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ProductDetailComponent implements OnInit, OnChanges {
  product!: Product; // Sản phẩm hiện tại
  relatedProducts: Product[] = []; // Sản phẩm liên quan
  token: string | null = null; // Token của người dùng
  quantity: number = 1; // Số lượng mặc định
  selectedSize: string = 'Nhỏ'; // Kích thước sản phẩm

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Lắng nghe sự thay đổi tham số productId và cập nhật sản phẩm

    // Lấy ID sản phẩm từ URL
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProductDetails(productId); // Tải chi tiết sản phẩm và sản phẩm liên quan
    }

    // Lấy token từ AuthService
    this.token = this.authService.getToken();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Kiểm tra nếu `productID` thay đổi và reload sản phẩm
    if (changes['productID']) {
      this.loadProductDetails(this.route.snapshot.paramMap.get('id')!);
    }
  }

  // Tải chi tiết sản phẩm và sản phẩm liên quan
  loadProductDetails(productId: string): void {
    forkJoin({
      product: this.productService.getProductById(productId),
      relatedProducts: this.productService.getRelatedProducts(productId)
    }).subscribe(({ product, relatedProducts }) => {
      this.product = product; // Lưu thông tin sản phẩm
      this.relatedProducts = relatedProducts;
     ; // Lưu thông tin sản phẩm liên quan
    }, error => {
      console.error('Lỗi khi tải thông tin sản phẩm:', error);
      alert('Có lỗi khi tải thông tin sản phẩm. Vui lòng thử lại!');
    });
  }
  loadRelatedProducts(productId: string) {
    // Gọi API hoặc service để lấy danh sách sản phẩm liên quan
    this.productService.getRelatedProducts(productId).subscribe(relatedProducts => {
      this.relatedProducts = relatedProducts;
    });
  }
  // Lấy URL hình ảnh của sản phẩm
  getImageUrl(imageUrl: string | undefined): string {
    return this.productService.getImageUrl(imageUrl || ''); // Trả về URL hình ảnh nếu có
  }

  // Thêm sản phẩm vào giỏ hàng
  addToCart(): void {
    if (!this.token) {
      alert('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!');
      return;
    }

    const user = this.authService.parseJwt(this.token);
    if (!user || !user.sub) {
      alert('Không thể xác thực người dùng. Vui lòng đăng nhập lại!');
      return;
    }

    const size = this.selectedSize || 'default-size';
    const image = this.product.imageURL || 'default-image-url';

    const cartRequest: CartRequest = {
      cartmodel: {
        cartID: this.cartService.generateUniqueID(),
        userID: user.userID,
        createdDate: new Date()
      },
      cartdetail: {
        cartDetailID: this.cartService.generateUniqueID(),
        cartID: 0, // Placeholder cho cartID, sẽ được gán sau
        productID: this.product.productID,
        quantity: this.quantity,
        price: this.product.price,
        size: size,
        image: image
      }
    };

    cartRequest.cartdetail.cartID = cartRequest.cartmodel.cartID;

    this.cartService.addToCart(cartRequest).subscribe(
      () => {
        alert('Sản phẩm đã được thêm vào giỏ hàng');
      },
      (error) => {
        console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
        alert('Có lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!');
      }
    );
  }

  // Thêm sản phẩm vào danh sách yêu thích (chức năng demo)
  addToFavorites(product: Product): void {
    console.log(`Thêm vào yêu thích: ${product.productName}`);
  }

  viewProductDetails(productId: string) {
    // Cập nhật đường dẫn và productID
    this.router.navigate(['/product-detail', productId]);
  }
}
