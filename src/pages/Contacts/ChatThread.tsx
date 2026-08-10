import { useEffect, useRef, useState, type FormEvent } from "react";
import { Download, FileText, Mic, Send, Square, X } from "lucide-react";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Field";
import { useMessages, useSendAudioMessage, useSendMessage } from "../../hooks/useMessages";
import { useGroupMessages, useSendGroupMessage } from "../../hooks/useGroups";
import type { Message } from "../../types/message";
import type { WhatsAppGroup } from "../../types/group";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function messageTime(message: Message) {
  return message.enviadoEm ?? message.criadoEm;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatDayLabel(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(date, now)) return "Hoje";
  if (isSameDay(date, yesterday)) return "Ontem";
  return date.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
}

function MessageBody({ message, onOpenImage }: { message: Message; onOpenImage: (url: string) => void }) {
  if ((message.messageType === "ImageMessage" || message.messageType === "StickerMessage") && message.mediaUrl) {
    return (
      <img
        src={message.mediaUrl}
        alt="Imagem recebida"
        onClick={() => onOpenImage(message.mediaUrl!)}
        className="max-h-64 max-w-full cursor-zoom-in rounded-md object-contain"
      />
    );
  }

  if (message.messageType === "VideoMessage" && message.mediaUrl) {
    return <video controls src={message.mediaUrl} className="max-h-64 max-w-full rounded-md" />;
  }

  if (message.messageType === "AudioMessage" && message.mediaUrl) {
    return <audio controls src={message.mediaUrl} className="h-9 max-w-full" />;
  }

  if (message.messageType === "DocumentMessage" && message.mediaUrl) {
    return (
      <a
        href={message.mediaUrl}
        download={message.fileName || undefined}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 rounded-md border border-current/20 px-2.5 py-2 hover:bg-black/5"
      >
        <FileText className="h-4 w-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate text-sm">{message.fileName || "Documento"}</span>
        <Download className="h-3.5 w-3.5 shrink-0" />
      </a>
    );
  }

  return <p className="whitespace-pre-wrap break-words">{message.content}</p>;
}

function useAudioRecorder(onDone: (blob: Blob) => void) {
  const [recording, setRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    recorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      onDone(new Blob(chunksRef.current, { type: "audio/webm" }));
    };
    recorder.start();
    recorderRef.current = recorder;
    setRecording(true);
  }

  function stop() {
    recorderRef.current?.stop();
    setRecording(false);
  }

  return { recording, start, stop };
}

function ThreadView({
  messages,
  isLoading,
  error,
  sending,
  allowAudio = false,
  audioSending = false,
  onSend,
  onSendAudio,
}: {
  messages: Message[] | undefined;
  isLoading: boolean;
  error: unknown;
  sending: boolean;
  allowAudio?: boolean;
  audioSending?: boolean;
  onSend: (content: string) => Promise<unknown>;
  onSendAudio?: (blob: Blob) => void;
}) {
  const [text, setText] = useState("");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recorder = useAudioRecorder((blob) => onSendAudio?.(blob));

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    setText("");
    await onSend(content);
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-4">
        {isLoading && <p className="text-xs text-text-tertiary">Carregando mensagens…</p>}
        {error != null && (
          <p className="text-xs text-danger">
            {error instanceof Error ? error.message : "Não foi possível carregar as mensagens."}
          </p>
        )}
        {!isLoading && !error && messages?.length === 0 && (
          <p className="text-xs text-text-tertiary">Nenhuma mensagem ainda.</p>
        )}
        {messages?.map((message, index) => {
          const previous = index > 0 ? messages[index - 1] : null;
          const showDayDivider = !previous || !isSameDay(new Date(messageTime(previous)), new Date(messageTime(message)));

          return (
            <div key={message.id}>
              {showDayDivider && (
                <div className="my-3 flex items-center justify-center">
                  <span className="rounded-full bg-surface-raised px-2.5 py-1 text-[11px] font-medium capitalize text-text-tertiary">
                    {formatDayLabel(messageTime(message))}
                  </span>
                </div>
              )}
              <div className={`flex ${message.direction === "out" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] rounded-lg px-3 py-1.5 text-sm ${
                    message.direction === "out"
                      ? "bg-accent text-white"
                      : "border border-border bg-surface-raised text-text-primary"
                  }`}
                >
                  <MessageBody message={message} onOpenImage={setLightbox} />
                  <p
                    className={`mt-0.5 text-[10px] ${
                      message.direction === "out" ? "text-white/70" : "text-text-tertiary"
                    }`}
                  >
                    {formatTime(messageTime(message))}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border p-3">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={recorder.recording ? "Gravando áudio…" : "Escreva uma mensagem…"}
          className="flex-1"
          disabled={recorder.recording}
        />
        {allowAudio && (
          <Button
            type="button"
            size="sm"
            variant={recorder.recording ? "danger" : "ghost"}
            icon={
              recorder.recording ? (
                <Square className="h-3.5 w-3.5" />
              ) : (
                <Mic className="h-3.5 w-3.5" />
              )
            }
            loading={audioSending}
            onClick={() => (recorder.recording ? recorder.stop() : recorder.start())}
            aria-label={recorder.recording ? "Parar gravação" : "Gravar áudio"}
          />
        )}
        <Button
          type="submit"
          size="sm"
          variant="primary"
          icon={<Send className="h-3.5 w-3.5" />}
          loading={sending}
          disabled={!text.trim() || recorder.recording}
          aria-label="Enviar mensagem"
        />
      </form>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setLightbox(null)}
        >
          <button
            aria-label="Fechar"
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => setLightbox(null)}
          >
            <X className="h-5 w-5" />
          </button>
          <img src={lightbox} alt="Imagem ampliada" className="max-h-full max-w-full rounded-md object-contain" />
        </div>
      )}
    </div>
  );
}

function ContactChatThread({ contactId }: { contactId: string }) {
  const { data: messages, isLoading, error } = useMessages(contactId);
  const sendMessage = useSendMessage(contactId);
  const sendAudio = useSendAudioMessage(contactId);

  return (
    <ThreadView
      messages={messages}
      isLoading={isLoading}
      error={error}
      sending={sendMessage.isPending}
      allowAudio
      audioSending={sendAudio.isPending}
      onSend={(content) => sendMessage.mutateAsync(content)}
      onSendAudio={(blob) => sendAudio.mutate(blob)}
    />
  );
}

function GroupChatThread({
  groupId,
  jid,
  nome,
  avatarUrl,
  participantes,
  onGroupCreated,
}: {
  groupId?: string;
  jid: string;
  nome?: string;
  avatarUrl?: string;
  participantes?: number;
  onGroupCreated?: (group: WhatsAppGroup) => void;
}) {
  const { data: messages, isLoading, error } = useGroupMessages(groupId);
  const sendGroupMessage = useSendGroupMessage();

  async function handleSend(content: string) {
    const result = await sendGroupMessage.mutateAsync({ jid, content, nome, avatarUrl, participantes });
    if (!groupId) onGroupCreated?.(result.group);
  }

  return (
    <ThreadView
      messages={groupId ? messages : []}
      isLoading={groupId ? isLoading : false}
      error={error}
      sending={sendGroupMessage.isPending}
      onSend={handleSend}
    />
  );
}

type ChatThreadProps =
  | { kind: "contact"; contactId: string }
  | {
      kind: "group";
      groupId?: string;
      jid: string;
      nome?: string;
      avatarUrl?: string;
      participantes?: number;
      onGroupCreated?: (group: WhatsAppGroup) => void;
    };

export default function ChatThread(props: ChatThreadProps) {
  if (props.kind === "group") {
    return (
      <GroupChatThread
        groupId={props.groupId}
        jid={props.jid}
        nome={props.nome}
        avatarUrl={props.avatarUrl}
        participantes={props.participantes}
        onGroupCreated={props.onGroupCreated}
      />
    );
  }
  return <ContactChatThread contactId={props.contactId} />;
}
