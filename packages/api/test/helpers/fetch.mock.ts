import { HttpStatus } from '@nestjs/common';

export function mockFetch(data, status: HttpStatus) {
  global.fetch = jest.fn().mockResolvedValue({
    status,
    json: async () => data,
  });
}
