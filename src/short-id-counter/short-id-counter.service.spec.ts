import { Test } from '@nestjs/testing';
import { ShortIdCounterModule } from './short-id-counter.module.js';
import { ShortIdCounterService } from './short-id-counter.service.js';

describe('ShortIdCounterService', () => {
  it('is a singleton and allocates consecutive base62 IDs', async () => {
    const module = await Test.createTestingModule({
      imports: [ShortIdCounterModule],
    }).compile();

    const firstReference = module.get(ShortIdCounterService);
    const secondReference = module.get(ShortIdCounterService);

    expect(firstReference).toBe(secondReference);
    expect(firstReference.next()).toBe('0');
    expect(secondReference.next()).toBe('1');

    await module.close();
  });
});
