import { ChatInterface } from "@/components/chat-interface";

export default function ChatPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline">Conversational AI Assistant</h1>
        <p className="text-muted-foreground">
          Ask me anything about our products, and I'll help you find the perfect item.
        </p>
      </div>
      <ChatInterface />
    </div>
  );
}
