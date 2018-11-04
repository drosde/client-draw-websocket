import { TestBed } from '@angular/core/testing';

import { PlayerSocketService } from './player-socket.service';

describe('PlayerSocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlayerSocketService = TestBed.get(PlayerSocketService);
    expect(service).toBeTruthy();
  });
});
