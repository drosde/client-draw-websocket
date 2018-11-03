import { TestBed } from '@angular/core/testing';

import { DrawHelperService } from './draw-helper.service';

describe('DrawHelperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrawHelperService = TestBed.get(DrawHelperService);
    expect(service).toBeTruthy();
  });
});
