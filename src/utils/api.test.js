import {describe, it, expect} from 'vitest';
import {parseApiResponse} from './api.js';

describe('parseApiResponse', () => {
  it('rejects HTML error pages instead of trying to parse JSON', async () => {
    const response = new Response('<!DOCTYPE html><html><body><h1>403 Forbidden</h1></body></html>', {
      status: 403,
      headers: {'Content-Type': 'text/html; charset=utf-8'},
    });

    await expect(parseApiResponse(response)).rejects.toThrow(/403|HTML|JSON/i);
  });
});
