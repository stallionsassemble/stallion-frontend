'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Smile } from 'lucide-react';
import { useState } from 'react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  disabled?: boolean;
}

interface EmojiData {
  native: string;
}

export function EmojiPicker({ onEmojiSelect, disabled }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);

  const handleEmojiSelect = (emoji: EmojiData) => {
    onEmojiSelect(emoji.native);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground shrink-0"
          disabled={disabled}
        >
          <Smile className="h-[25px] w-[25px]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="end" className="w-full border-none p-0">
        <Picker
          data={data}
          onEmojiSelect={handleEmojiSelect}
          theme="auto"
          previewPosition="none"
          skinTonePosition="search"
        />
      </PopoverContent>
    </Popover>
  );
}
