import { Component, HostListener } from '@angular/core';
import { ProductCardComponent } from "../../@component/product-card/product-card.component";
import { LucideAngularModule, X, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { RouterLink } from '@angular/router';
import { ProductListingStateService } from '../../@Services/product-listing-state.service';
import { UiBehaviorService } from '../../@Services/ui-behavior.service';

@Component({
  selector: 'app-school-community-product',
  imports: [LucideAngularModule, FormsModule, NgxSliderModule, ProductCardComponent, RouterLink],
  templateUrl: './school-community-product.component.html',
  styleUrl: './school-community-product.component.scss'
})
export class SchoolCommunityProductComponent {

  readonly XIcon         = X;
  readonly RotateCcwIcon = RotateCcw;
  readonly nextIcon      = ChevronRight;
  readonly prevIcon      = ChevronLeft;

  constructor(
    public state: ProductListingStateService,
    private uiBehavior: UiBehaviorService,
  ) {}

  // ── Panel ─────────────────────────────────────────────
  togglePanel(event: Event, panel: keyof typeof this.state.panelState): void {
    this.uiBehavior.togglePanel(event, this.state.panelState, panel);
  }

  @HostListener('document:click')
  closeMenu(): void {
    this.uiBehavior.closeAll(this.state.panelState);
  }

  // ── Sort ──────────────────────────────────────────────
  setSort(option: typeof this.state.sortOption, event: Event): void {
    event.stopPropagation();
    this.state.sortOption = option;
    this.state.panelState.sort = false;
    this.state.pagination.goToPage(1);
  }

  // ── Pagination ────────────────────────────────────────
  prevPage(): void { this.state.pagination.prevPage(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  nextPage(): void { this.state.pagination.nextPage(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  goToPage(page: number): void { this.state.pagination.goToPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  // ── Filter ────────────────────────────────────────────
  onCityChange(): void {
    this.state.pagination.goToPage(1);
    this.state.updatePagination();
  }

  onDeptChange(): void {
    this.state.pagination.goToPage(1);
    this.state.updatePagination();
  }

  clearAllFilters(event: Event): void {
    event.stopPropagation();
    this.state.resetFilters();
    this.state.resetQuery();
  }
}
