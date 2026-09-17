import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Wish2026 } from './wish2026';

describe('Wish', () => {
  let component: Wish2026;
  let fixture: ComponentFixture<Wish2026>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Wish2026],
    }).compileComponents();

    fixture = TestBed.createComponent(Wish2026);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
