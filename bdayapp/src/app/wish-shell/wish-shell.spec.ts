import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishShell } from './wish-shell';

describe('WishShell', () => {
  let component: WishShell;
  let fixture: ComponentFixture<WishShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishShell],
    }).compileComponents();

    fixture = TestBed.createComponent(WishShell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
