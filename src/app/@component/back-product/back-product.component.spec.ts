import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackProductComponent } from './back-product.component';

describe('BackProductComponent', () => {
  let component: BackProductComponent;
  let fixture: ComponentFixture<BackProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
