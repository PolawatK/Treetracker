import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeInput } from './tree-input';

describe('TreeInput', () => {
  let component: TreeInput;
  let fixture: ComponentFixture<TreeInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
