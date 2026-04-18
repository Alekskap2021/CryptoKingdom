import { WebsocketClient, type WsTopicRequest } from "bybit-api";

export type WsMessageHandler = (topic: string, data: unknown) => void;

export interface WsManagerOptions {
 apiKey: string;
 apiSecret: string;
 onMessage: WsMessageHandler;
 testnet?: boolean;
}

export class BybitWsManager {
 private client: WebsocketClient;
 private onMessage: WsMessageHandler;
 private subscriptions = new Set<string>();

 constructor(options: WsManagerOptions) {
  this.onMessage = options.onMessage;

  this.client = new WebsocketClient({
   key: options.apiKey,
   market: "v5",
   secret: options.apiSecret,
   testnet: options.testnet,
  });

  this.client.on("update", (msg) => {
   if (msg.topic) {
    this.onMessage(msg.topic, msg.data);
   }
  });

  this.client.on("error", (err) => {
   console.error("[BybitWS] error:", err);
  });
 }

 close() {
  this.subscriptions.clear();
  this.client.closeAll();
 }

 subscribe(topics: string[]) {
  const newTopics = topics.filter((t) => !this.subscriptions.has(t));
  if (newTopics.length === 0) return;

  for (const topic of newTopics) {
   this.subscriptions.add(topic);
  }

  this.client.subscribeV5(newTopics as WsTopicRequest[], "linear");
 }

 unsubscribe(topics: string[]) {
  for (const topic of topics) {
   this.subscriptions.delete(topic);
  }
  this.client.unsubscribeV5(topics as WsTopicRequest[], "linear");
 }
}

export const PRIVATE_WS_TOPICS = {
 execution: "execution",
 order: "order",
 position: "position",
 wallet: "wallet",
} as const;
