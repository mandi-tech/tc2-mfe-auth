import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovoUsuario } from './novo-usuario';

describe('NovoUsuario', () => {
  let component: NovoUsuario;
  let fixture: ComponentFixture<NovoUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NovoUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovoUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
