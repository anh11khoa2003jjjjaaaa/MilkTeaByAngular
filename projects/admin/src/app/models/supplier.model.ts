export interface Supplier {
    supplierID: string;
    supplierName: string;
    phone?: string; // Thuộc tính tùy chọn, vì không bắt buộc
    email?: string; // Thuộc tính tùy chọn
    address?: string; // Thuộc tính tùy chọn
}