import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResenasPropiedadComponent } from './resenas-propiedad.component';

describe('ResenasPropiedadComponent', () => {
  let component: ResenasPropiedadComponent;
  let fixture: ComponentFixture<ResenasPropiedadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResenasPropiedadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResenasPropiedadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
