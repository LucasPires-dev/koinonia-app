import { useEffect, useRef, useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Field";
import { useMessages, useSendMessage } from "../../hooks/useMessages";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatThread({ contactId }: { contactId: string }) {
  const { data: messages, isLoading, error } = useMessages(contactId);
  const sendMessage = useSendMessage(contactId);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    setText("");
    await sendMessage.mutateAsync(content);
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-4">
        {isLoading && <p className="text-xs text-text-tertiary">Carregando mensagens…</p>}
        {error && (
          <p className="text-xs text-danger">
            {error instanceof Error ? error.message : "Não foi possível carregar as mensagens."}
          </p>
        )}
        {!isLoading && !error && messages?.length === 0 && (
          <p className="text-xs text-text-tertiary">Nenhuma mensagem ainda.</p>
        )}
        {messages?.map((message) => (
          <div key={message.id} className={`flex ${message.direction === "out" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[70%] rounded-lg px-3 py-1.5 text-sm ${
                message.direction === "out"
                  ? "bg-accent text-white"
                  : "border border-border bg-surface-raised text-text-primary"
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
              <p
                className={`mt-0.5 text-[10px] ${
                  message.direction === "out" ? "text-white/70" : "text-text-tertiary"
                }`}
              >
                {formatTime(message.criadoEm)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border p-3">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva uma mensagem…"
          className="flex-1"
        />
        <Button
          type="submit"
          size="sm"
          variant="primary"
          icon={<Send className="h-3.5 w-3.5" />}
          loading={sendMessage.isPending}
          disabled={!text.trim()}
          aria-label="Enviar mensagem"
        />
      </form>
    </div>
  );
}
