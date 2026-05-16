'use client';

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Bot, GripHorizontal, Maximize2, MessageCircle, Minimize2, Send, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatbotStore } from '@/stores/chat-bot.store';
import type { ChatbotApiResponse, ChatMessageWithApiResponse, ProductAdvisorResponse } from '@/types/chatbot.type';
import { ProductAdvisorMessage } from './ProductAdvisorMessage';
import { useAuthStore } from '@/stores/auth-store';
import { sendChatMessage } from '@/services/chat.service';
import { getChatQuickReplyTags } from '@/lib/chatbot-suggestions';

type Position = {
  x: number;
  y: number;
};

const MOBILE_PANEL_WIDTH = 384;
const MOBILE_PANEL_HEIGHT = 620;
const DESKTOP_PANEL_WIDTH = 430;
const DESKTOP_PANEL_HEIGHT = 640;
const LARGE_PANEL_WIDTH = 460;
const LARGE_PANEL_HEIGHT = 660;
const VIEWPORT_PADDING = 12;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getResponsivePanelWidth() {
  if (typeof window === 'undefined') return MOBILE_PANEL_WIDTH;

  if (window.innerWidth >= 1280) return LARGE_PANEL_WIDTH;
  if (window.innerWidth >= 1024) return DESKTOP_PANEL_WIDTH;

  return MOBILE_PANEL_WIDTH;
}

function getResponsivePanelHeight() {
  if (typeof window === 'undefined') return MOBILE_PANEL_HEIGHT;

  if (window.innerWidth >= 1280) return LARGE_PANEL_HEIGHT;
  if (window.innerWidth >= 1024) return DESKTOP_PANEL_HEIGHT;

  return MOBILE_PANEL_HEIGHT;
}

function getPanelSize() {
  if (typeof window === 'undefined') {
    return {
      width: MOBILE_PANEL_WIDTH,
      height: MOBILE_PANEL_HEIGHT
    };
  }

  return {
    width: Math.min(getResponsivePanelWidth(), window.innerWidth - VIEWPORT_PADDING * 2),
    height: Math.min(getResponsivePanelHeight(), window.innerHeight - VIEWPORT_PADDING * 2)
  };
}

function getBoundedPosition(position: Position, width: number, height: number) {
  if (typeof window === 'undefined') return position;

  return {
    x: clamp(position.x, VIEWPORT_PADDING, Math.max(VIEWPORT_PADDING, window.innerWidth - width - VIEWPORT_PADDING)),
    y: clamp(position.y, VIEWPORT_PADDING, Math.max(VIEWPORT_PADDING, window.innerHeight - height - VIEWPORT_PADDING))
  };
}

function TypingIndicator() {
  return (
    <div className='flex items-center gap-1.5 py-1'>
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className='bg-muted-foreground/70 h-2 w-2 animate-bounce rounded-full'
          style={{
            animationDelay: `${index * 140}ms`,
            animationDuration: '800ms'
          }}
        />
      ))}
    </div>
  );
}

function AssistantAvatar() {
  return (
    <div className='ring-background flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-yellow-950 shadow-sm ring-2'>
      <Bot className='h-4 w-4' />
    </div>
  );
}

export default function FloatingChatbotAssistant() {
  const { open, fullscreen, messages, setOpen, setFullscreen, addMessage, clearMessages, ensureDefaultGreeting } =
    useChatbotStore();

  const user = useAuthStore((state) => state.user);
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);

  const userName = [user?.lastName, user?.firstName].filter(Boolean).join(' ').trim() || undefined;

  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dragRef = useRef({
    isDragging: false,
    offsetX: 0,
    offsetY: 0,
    width: MOBILE_PANEL_WIDTH,
    height: MOBILE_PANEL_HEIGHT
  });

  const panelRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open || !isAuthInitialized) return;

    ensureDefaultGreeting(userName);
  }, [open, isAuthInitialized, userName, ensureDefaultGreeting]);

  useEffect(() => {
    function handleResize() {
      if (!open || fullscreen || !hasDragged) return;

      const { width, height } = getPanelSize();
      setPosition((current) => getBoundedPosition(current, width, height));
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [open, fullscreen, hasDragged]);

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      if (!dragRef.current.isDragging || fullscreen) return;

      const nextPosition = getBoundedPosition(
        {
          x: event.clientX - dragRef.current.offsetX,
          y: event.clientY - dragRef.current.offsetY
        },
        dragRef.current.width,
        dragRef.current.height
      );

      setPosition(nextPosition);
    }

    function handlePointerUp() {
      dragRef.current.isDragging = false;
      document.body.style.userSelect = '';
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [fullscreen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  function startDragging(event: ReactPointerEvent<HTMLElement>) {
    if (fullscreen || !panelRef.current) return;

    const rect = panelRef.current.getBoundingClientRect();

    setHasDragged(true);
    setPosition({ x: rect.left, y: rect.top });

    dragRef.current = {
      isDragging: true,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      height: rect.height
    };

    document.body.style.userSelect = 'none';
  }

  function openPanel() {
    if (isAuthInitialized) {
      ensureDefaultGreeting(userName);
    }

    setHasDragged(false);
    setOpen(true);
  }

  function closePanel() {
    setFullscreen(false);
    setHasDragged(false);
    setOpen(false);
  }

  async function sendMessageWithContent(rawContent: string) {
    const content = rawContent.trim();
    if (!content || isLoading) return;

    addMessage({
      role: 'user',
      content
    });

    setInput('');
    setIsLoading(true);

    try {
      const data = await sendChatMessage(content);

      addMessage({
        role: 'assistant',
        content: data.success
          ? data.response || 'Xin lỗi, mình chưa có phản hồi phù hợp.'
          : data.message || data.response || 'Xin lỗi, mình chưa có phản hồi phù hợp.',
        apiResponse: data
      });
    } catch {
      addMessage({
        role: 'assistant',
        content: 'Xin lỗi, hiện tại mình chưa nhận được phản hồi. Bạn thử lại sau nhé.'
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function sendMessage() {
    await sendMessageWithContent(input);
  }

  if (!open) {
    return (
      <Button
        type='button'
        size='icon'
        aria-label='Mở chatbot assistant'
        onClick={openPanel}
        className='fixed right-6 bottom-6 z-60 h-14 w-14 rounded-full shadow-2xl'
      >
        <MessageCircle className='h-6 w-6' />
      </Button>
    );
  }

  const lastAssistantMessage = [...messages].reverse().find((message) => message.role === 'assistant');

  const quickReplyTags = getChatQuickReplyTags(lastAssistantMessage?.apiResponse);

  return (
    <Card
      ref={panelRef}
      className={cn(
        'fixed z-60 flex overflow-hidden border py-2 shadow-xl transition-[width,height,border-radius] duration-200',
        fullscreen
          ? 'inset-0 h-dvh w-screen rounded-none'
          : hasDragged
            ? 'h-[min(620px,calc(100dvh-24px))] w-[min(384px,calc(100vw-24px))] rounded-2xl lg:h-[min(620px,calc(100dvh-24px))] lg:w-[min(450px,calc(100vw-24px))] xl:h-[min(620px,calc(100dvh-24px))] xl:w-[min(500px,calc(100vw-24px))]'
            : 'right-6 bottom-6 h-[min(620px,calc(100dvh-48px))] w-[min(384px,calc(100vw-48px))] rounded-2xl lg:h-[min(620px,calc(100dvh-48px))] lg:w-[min(450px,calc(100vw-48px))] xl:h-[min(620px,calc(100dvh-48px))] xl:w-[min(500px,calc(100vw-48px))]'
      )}
      style={
        fullscreen || !hasDragged
          ? undefined
          : {
              left: position.x,
              top: position.y,
              touchAction: 'none'
            }
      }
    >
      <div className='bg-background flex h-full min-h-0 w-full flex-col overflow-hidden'>
        <header
          onPointerDown={startDragging}
          className={cn(
            'flex items-center justify-between gap-3 border-b px-4 py-3',
            fullscreen ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
          )}
        >
          <div className='flex min-w-0 items-center gap-3'>
            <div className='bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full'>
              <Bot className='h-5 w-5' />
            </div>

            <div className='min-w-0'>
              <p className='truncate text-sm font-semibold'>Chatbot Assistant</p>
              <p className='text-muted-foreground truncate text-xs'>Kéo thanh này để di chuyển</p>
            </div>
          </div>

          <div className='flex items-center gap-1'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='hidden h-8 px-2 text-xs sm:inline-flex'
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => clearMessages(userName)}
            >
              Xoá chat
            </Button>

            <GripHorizontal className='text-muted-foreground hidden h-5 w-5 sm:block' />

            <Button
              type='button'
              variant='ghost'
              size='icon'
              aria-label={fullscreen ? 'Thu nhỏ chatbot' : 'Mở toàn màn hình'}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => setFullscreen(!fullscreen)}
            >
              {fullscreen ? <Minimize2 className='h-4 w-4' /> : <Maximize2 className='h-4 w-4' />}
            </Button>

            <Button
              type='button'
              variant='ghost'
              size='icon'
              aria-label='Đóng chatbot assistant'
              onPointerDown={(event) => event.stopPropagation()}
              onClick={closePanel}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        </header>

        <ScrollArea className='min-h-0 flex-1 px-4 py-2'>
          <div className='space-y-3 pr-3'>
            {messages.map((rawMessage) => {
              const message = rawMessage as ChatMessageWithApiResponse;
              const isUser = message.role === 'user';

              const productResponse: ProductAdvisorResponse | undefined =
                message.role === 'assistant' && message.apiResponse?.success && message.apiResponse.intent === 'product'
                  ? (message.apiResponse as ProductAdvisorResponse)
                  : undefined;

              return (
                <div key={message.id} className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
                  {isUser ? (
                    <div className='bg-primary text-primary-foreground max-w-full rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-line'>
                      {message.content}
                    </div>
                  ) : (
                    <div className='flex max-w-full items-end gap-2'>
                      <AssistantAvatar />

                      {productResponse ? (
                        <ProductAdvisorMessage data={productResponse} fullscreen={fullscreen} />
                      ) : (
                        <div
                          className={cn(
                            'bg-muted text-foreground rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-line',
                            fullscreen ? 'max-w-[60%]' : 'max-w-full'
                          )}
                        >
                          {message.content}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className='flex justify-start gap-2'>
                <AssistantAvatar />

                <div className='bg-background flex max-w-[82%] items-center rounded-[999px] p-2'>
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {quickReplyTags.length > 0 && (
          <div className='my-2 flex flex-wrap gap-2 px-3'>
            {quickReplyTags.map((tag) => (
              <button
                key={tag.question}
                type='button'
                disabled={isLoading}
                onClick={() => {
                  if (isLoading) return;
                  setInput(tag.question);
                  sendMessageWithContent(tag.question);
                }}
                className='hover:bg-muted cursor-pointer rounded-full border px-3 py-1 text-xs transition disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent'
              >
                {tag.label}
              </button>
            ))}
          </div>
        )}

        <form
          className='flex items-center gap-2 border-t p-3'
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage();
          }}
        >
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={isLoading ? 'Đang chờ phản hồi...' : 'Nhập tin nhắn...'}
            disabled={isLoading}
            className='h-11'
          />

          <Button
            type='submit'
            size='icon'
            aria-label='Gửi tin nhắn'
            disabled={isLoading || !input.trim()}
            className='h-11 w-11'
          >
            <Send className='h-4 w-4' />
          </Button>
        </form>
      </div>
    </Card>
  );
}
