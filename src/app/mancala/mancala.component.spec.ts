import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MancalaComponent } from './mancala.component';

describe('MancalaComponent', () => {
  let component: MancalaComponent;
  let fixture: ComponentFixture<MancalaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MancalaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MancalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
