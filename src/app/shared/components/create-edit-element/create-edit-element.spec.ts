import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditElement } from './create-edit-element';

describe('CreateEditElement', () => {
  let component: CreateEditElement;
  let fixture: ComponentFixture<CreateEditElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditElement],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditElement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
