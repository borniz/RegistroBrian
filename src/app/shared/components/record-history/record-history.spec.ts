import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordHistory } from './record-history';

describe('RecordHistory', () => {
  let component: RecordHistory;
  let fixture: ComponentFixture<RecordHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(RecordHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
