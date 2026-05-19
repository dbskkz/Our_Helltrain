import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  currentPage = 1;
  totalPages = 1;
  pageNumbers: number[] = [];

  init(total: number, pageSize: number) {
    this.currentPage = 1;
    this.totalPages = Math.ceil(total / pageSize);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  prevPage(): boolean {
    if (this.currentPage > 1) {
      this.currentPage--;
      return true;
    }
    return false;
  }

  nextPage(): boolean {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      return true;
    }
    return false;
  }

  goToPage(page: number): boolean {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      return true;
    }
    return false;
  }
}
