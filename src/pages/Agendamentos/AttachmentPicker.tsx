import { useRef } from "react";
import { FileAudio, FileText, FileVideo, Image as ImageIcon, Paperclip, X } from "lucide-react";
import Button from "../../components/ui/Button";
import { Label } from "../../components/ui/Field";
import type { MessageAttachment } from "../../types/scheduledMessage";

function iconFor(mimeType: string) {
  if (mimeType.startsWith("image/")) return ImageIcon;
  if (mimeType.startsWith("video/")) return FileVideo;
  if (mimeType.startsWith("audio/")) return FileAudio;
  if (mimeType === "application/pdf") return FileText;
  return Paperclip;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AttachmentPicker({
  value,
  onChange,
  onFilesAdded,
  disabled,
}: {
  value: MessageAttachment[];
  onChange: (attachments: MessageAttachment[]) => void;
  /** Recebe os File brutos recém-selecionados (mesmo id usado no MessageAttachment correspondente),
   * para quem precisar fazer upload de verdade sem alterar o tipo público MessageAttachment. */
  onFilesAdded?: (pairs: { id: string; file: File }[]) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const added: MessageAttachment[] = files.map((file) => ({
      id: crypto.randomUUID(),
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }));
    onChange([...value, ...added]);
    onFilesAdded?.(added.map((attachment, i) => ({ id: attachment.id, file: files[i] })));
    e.target.value = "";
  }

  function remove(id: string) {
    onChange(value.filter((a) => a.id !== id));
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <Label>Anexos</Label>
        {!disabled && (
          <Button size="sm" variant="ghost" icon={<Paperclip className="h-3.5 w-3.5" />} onClick={() => inputRef.current?.click()}>
            Anexar arquivo
          </Button>
        )}
        <input ref={inputRef} type="file" multiple hidden onChange={handleFiles} />
      </div>

      {value.length > 0 && (
        <ul className="space-y-1.5">
          {value.map((attachment) => {
            const Icon = iconFor(attachment.mimeType);
            return (
              <li
                key={attachment.id}
                className="flex items-center gap-2.5 rounded-md border border-border bg-surface px-2.5 py-2"
              >
                {attachment.previewUrl ? (
                  <img src={attachment.previewUrl} alt="" className="h-8 w-8 shrink-0 rounded object-cover" />
                ) : (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-surface-hover text-text-tertiary">
                    <Icon className="h-4 w-4" />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-medium text-text-primary">{attachment.fileName}</span>
                  <span className="block text-[11px] text-text-tertiary">{formatSize(attachment.size)}</span>
                </span>
                {!disabled && (
                  <button
                    type="button"
                    aria-label={`Remover ${attachment.fileName}`}
                    onClick={() => remove(attachment.id)}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-text-tertiary hover:bg-surface-hover hover:text-text-primary"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
