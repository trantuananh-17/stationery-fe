'use client';

import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Underline
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type Props = {
  value?: string;
  onChange?: (value: string) => void;
};

const colors = ['#111827', '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6'];

export default function TiptapEditor({ value = '', onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      })
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'min-h-[220px] max-h-[420px] overflow-y-auto px-3 py-3 outline-none prose prose-sm max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6'
      }
    },
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    }
  });

  if (!editor) return null;

  return (
    <div className='bg-background overflow-hidden rounded-lg border'>
      <div className='bg-background border-b'>
        <div className='flex flex-wrap items-center gap-1 px-2 py-1'>
          <FormatSelect editor={editor} />

          <Divider />

          <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold className='size-4' />
          </ToolbarButton>

          <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic className='size-4' />
          </ToolbarButton>

          <ToolbarButton
            active={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <Underline className='size-4' />
          </ToolbarButton>

          <ColorPicker editor={editor} />

          <Divider />

          <ToolbarButton
            active={editor.isActive({ textAlign: 'left' })}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          >
            <AlignLeft className='size-4' />
          </ToolbarButton>

          <ToolbarButton
            active={editor.isActive({ textAlign: 'center' })}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          >
            <AlignCenter className='size-4' />
          </ToolbarButton>

          <ToolbarButton
            active={editor.isActive({ textAlign: 'right' })}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          >
            <AlignRight className='size-4' />
          </ToolbarButton>

          <Divider />

          <ToolbarButton
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className='size-4' />
          </ToolbarButton>

          <ToolbarButton
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className='size-4' />
          </ToolbarButton>
        </div>
      </div>

      <EditorContent editor={editor} className='[&_.ProseMirror]:min-h-[220px] [&_.ProseMirror]:p-4 [&_p]:my-0' />
    </div>
  );
}

function FormatSelect({ editor }: { editor: Editor }) {
  const label = editor.isActive('heading', { level: 1 })
    ? 'Heading 1'
    : editor.isActive('heading', { level: 2 })
      ? 'Heading 2'
      : editor.isActive('heading', { level: 3 })
        ? 'Heading 3'
        : editor.isActive('blockquote')
          ? 'Blockquote'
          : 'Paragraph';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type='button' variant='ghost' className='shrink-0 justify-between rounded-md px-3'>
          <span className='truncate'>{label}</span>
          <ChevronDown className='size-4 shrink-0' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='start' className='w-56'>
        <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>
          <Pilcrow className='mr-2 size-4' />
          Paragraph
        </DropdownMenuItem>

        {[1, 2, 3, 4, 5, 6].map((level) => (
          <DropdownMenuItem
            key={level}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 })
                .run()
            }
            className={cn(
              level === 1 && 'text-3xl font-bold',
              level === 2 && 'text-2xl font-bold',
              level === 3 && 'text-xl font-semibold',
              level === 4 && 'text-lg font-semibold',
              level === 5 && 'text-base font-semibold',
              level === 6 && 'text-sm font-semibold'
            )}
          >
            Heading {level}
          </DropdownMenuItem>
        ))}

        <DropdownMenuItem onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className='mr-2 size-4' />
          Blockquote
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ColorPicker({ editor }: { editor: Editor }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type='button' variant='ghost' size='icon' className='size-8 shrink-0 rounded-md'>
          <span className='text-base font-semibold underline underline-offset-4'>A</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align='start' className='w-44 p-2'>
        <div className='grid grid-cols-4 gap-2'>
          {colors.map((color) => (
            <button
              key={color}
              type='button'
              className='size-7 rounded-md border'
              style={{ backgroundColor: color }}
              onClick={() => editor.chain().focus().setColor(color).run()}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ToolbarButton({
  active,
  onClick,
  children
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type='button'
      variant='ghost'
      size='icon'
      onClick={onClick}
      className={cn('size-8 shrink-0 rounded-md', active && 'bg-muted text-primary')}
    >
      {children}
    </Button>
  );
}

function Divider() {
  return <div className='bg-border mx-1 hidden h-6 w-px sm:block' />;
}
