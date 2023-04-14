import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieEditorComponent } from './cookie-editor.component';

describe('CookieEditorComponent', () => {
  let component: CookieEditorComponent;
  let fixture: ComponentFixture<CookieEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CookieEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookieEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
