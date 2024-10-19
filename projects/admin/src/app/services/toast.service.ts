import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private messageService: MessageService) {}

  showSuccess(detail: string) {
    this.messageService.add({ severity: 'success', summary: 'Thành công', detail });
  }

  showInfo(detail: string) {
    this.messageService.add({ severity: 'info', summary: 'Cập nhật', detail });
  }

  showWarning(detail: string) {
    this.messageService.add({ severity: 'warn', summary: 'Cảnh báo', detail });
  }

  showError(detail: string) {
    this.messageService.add({ severity: 'error', summary: 'Lỗi', detail });
  }
}
