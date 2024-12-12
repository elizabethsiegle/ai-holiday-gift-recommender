import { z } from 'zod';

// Gift recommendation schema
export const GiftRecSchema = z.object({
  friendName: z.string(),
  recommendations: z.array(z.string()),
  timestamp: z.string()
});

export type GiftRec = z.infer<typeof GiftRecSchema>;

export class GiftListStore {
  private storage: DurableObjectStorage;

  constructor(state: DurableObjectState) {
    this.storage = state.storage;
  }

  async fetch(request: Request) {
    if (request.method === 'POST') {
      const data = GiftRecSchema.parse(await request.json());
      let gifts: GiftRec[] = await this.storage.get('gifts') || [];
      gifts = [...gifts, data];
      await this.storage.put('gifts', gifts);
      return new Response('Saved');
    }
    if (request.method === 'DELETE') {
        await this.storage.deleteAll();
        return new Response('Storage cleared', { status: 200 });
    }

    // GET request
    const gifts = await this.storage.get('gifts') || [];
    return new Response(JSON.stringify(gifts), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

interface Env {
  GIFT_RECS_STORE: DurableObjectNamespace;
}
