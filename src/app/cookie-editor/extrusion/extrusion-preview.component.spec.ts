import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtrusionPreviewComponent } from './extrusion-preview.component';

describe('ExtrusionPreviewComponent', () => {
  let component: ExtrusionPreviewComponent;
  let fixture: ComponentFixture<ExtrusionPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtrusionPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtrusionPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
