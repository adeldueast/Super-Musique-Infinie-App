/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ChansonsComponent } from './chansons.component';

describe('ChansonsComponent', () => {
  let component: ChansonsComponent;
  let fixture: ComponentFixture<ChansonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChansonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChansonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
