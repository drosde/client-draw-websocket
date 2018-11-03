import { TestBed } from '@angular/core/testing';

import { DrawSocketService } from './draw-socket.service';

describe('DrawSocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrawSocketService = TestBed.get(DrawSocketService);
    expect(service).toBeTruthy();
  });
});
