import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtrusionExportSettingsComponent } from './extrusion-export-settings.component';

describe('ExtrusionExportSettingsComponent', () => {
  let component: ExtrusionExportSettingsComponent;
  let fixture: ComponentFixture<ExtrusionExportSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtrusionExportSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtrusionExportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
