import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ourstory } from './ourstory';

describe('Ourstory', () => {
  let component: Ourstory;
  let fixture: ComponentFixture<Ourstory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ourstory],
    }).compileComponents();

    fixture = TestBed.createComponent(Ourstory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
