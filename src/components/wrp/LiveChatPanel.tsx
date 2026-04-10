"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { MessageCircle, X, Send, Users, Pin } from 'lucide-react';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ChatMessage {
    id: string;
    senderName: string;
    senderId: string;
    text: string;
    timestamp: number;
}

interface EmojiAction {
    id: string;
    emoji: string;
    x: number;
}

export default function LiveChatPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [roomCode, setRoomCode] = useState('');
    const [joinedRoom, setJoinedRoom] = useState<string | null>(null);

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputVal, setInputVal] = useState('');

    const [emojis, setEmojis] = useState<EmojiAction[]>([]);
    const [onlineCount, setOnlineCount] = useState(0);

    const [pinnedQ, setPinnedQ] = useState<string | null>(null);

    const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const myLoginId = useRef<string>('');
    const myName = useRef<string>('');

    useEffect(() => {
        myLoginId.current = localStorage.getItem('ioai_user') || 'guest-' + Math.random().toString(36).slice(2, 7);
        myName.current = localStorage.getItem('ioai_name') || 'Guest';
    }, []);

    // Auto-scroll logic
    useEffect(() => {
        if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    // Clean up floating emojis after animation (CSS animation lasts 2.5s)
    useEffect(() => {
        if (emojis.length > 0) {
            const timer = setTimeout(() => {
                setEmojis(prev => prev.filter(e => Date.now() - parseInt(e.id.split('-')[1]) < 2500));
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [emojis]);

    useEffect(() => {
        if (!joinedRoom) return;

        const ch = supabase.channel(`live-chat-${joinedRoom}`, {
            config: { broadcast: { self: true }, presence: { key: myLoginId.current } }
        });
        channelRef.current = ch;

        ch.on('broadcast', { event: 'message' }, ({ payload }) => {
            setMessages(m => [...m, payload as ChatMessage]);
        })
            .on('broadcast', { event: 'emoji' }, ({ payload }) => {
                setEmojis(prev => [...prev, payload as EmojiAction]);
            })
            .on('broadcast', { event: 'pin' }, ({ payload }) => {
                setPinnedQ(payload.text);
            })
            .on('presence', { event: 'sync' }, () => {
                const state = ch.presenceState();
                setOnlineCount(Object.keys(state).length);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await ch.track({ name: myName.current });
                }
            });

        return () => {
            supabase.removeChannel(ch);
        };
    }, [joinedRoom]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputVal.trim() || !channelRef.current) return;

        const msg: ChatMessage = {
            id: Math.random().toString(36).slice(2),
            senderName: myName.current,
            senderId: myLoginId.current,
            text: inputVal.trim(),
            timestamp: Date.now()
        };

        channelRef.current.send({ type: 'broadcast', event: 'message', payload: msg });
        setInputVal('');
    };

    const blastEmoji = (char: string) => {
        if (!channelRef.current) return;
        const action: EmojiAction = {
            id: Math.random().toString(36).slice(2) + '-' + Date.now(),
            emoji: char,
            x: Math.random() * 80 + 10 // random percentage across the screen
        };
        channelRef.current.send({ type: 'broadcast', event: 'emoji', payload: action });
    };

    const handlePin = () => {
        if (!channelRef.current) return;
        const text = prompt("Enter Question of the Day to Pin:");
        if (text) {
            channelRef.current.send({ type: 'broadcast', event: 'pin', payload: { text } });
        }
    };

    return (
        <>
            {/* Floating Emojis Layer */}
            <div className="fixed inset-0 pointer-events-none z-[1000] overflow-hidden">
                {emojis.map(e => (
                    <div
                        key={e.id}
                        className="absolute bottom-0 text-4xl animate-float-up drop-shadow-lg"
                        style={{ left: `${e.x}%` }}
                    >
                        {e.emoji}
                    </div>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes floatUp {
          0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
          20% { opacity: 1; transform: translateY(80vh) scale(1.2); }
          100% { transform: translateY(-20vh) scale(1); opacity: 0; }
        }
        .animate-float-up {
          animation: floatUp 2.5s ease-out forwards;
        }
      `}} />

            {/* Floating Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 p-4 bg-accent text-black rounded-full shadow-2xl hover:bg-accent/90 transition-transform hover:scale-105 z-[100] flex items-center gap-2 group"
                >
                    <MessageCircle className="w-6 h-6" />
                    <span className="font-bold hidden group-hover:inline-block pr-2 w-max">Live Chat</span>
                    {onlineCount > 0 && joinedRoom && (
                        <span className="absolute -top-2 -right-2 bg-error text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-background">
                            {onlineCount}
                        </span>
                    )}
                </button>
            )}

            {/* Live Chat Panel */}
            <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-secondary border-l border-border-subtle shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-[105%]'}`}>

                {/* Header */}
                <div className="p-4 border-b border-border-subtle bg-background flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-accent" />
                        <span className="font-bold">Live Room Chat</span>
                        {joinedRoom && (
                            <span className="bg-accent/20 text-accent text-xs px-2 py-0.5 rounded-full font-mono font-bold tracking-wider">
                                {joinedRoom}
                            </span>
                        )}
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-secondary-text hover:text-foreground p-1 rounded-lg hover:bg-secondary transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Room Gate */}
                {!joinedRoom ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                        <Users className="w-12 h-12 text-accent mb-4" />
                        <h3 className="text-lg font-bold mb-2">Join the Conversation</h3>
                        <p className="text-secondary-text text-sm mb-6">Enter your class session code to chat and react live with your huddle.</p>
                        <input
                            type="text"
                            value={roomCode}
                            onChange={e => setRoomCode(e.target.value.toUpperCase())}
                            placeholder="CLASS-A"
                            className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-center tracking-widest font-bold uppercase mb-4 focus:border-accent outline-none"
                            onKeyDown={e => e.key === 'Enter' && roomCode.trim() && setJoinedRoom(roomCode.trim())}
                        />
                        <button
                            onClick={() => setJoinedRoom(roomCode.trim())}
                            disabled={!roomCode.trim()}
                            className="w-full bg-accent text-black font-bold py-3 rounded-lg hover:bg-accent/90 transition-all disabled:opacity-50"
                        >
                            Enter Room
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Online Status */}
                        <div className="bg-accent/10 px-4 py-2 border-b border-accent/20 flex justify-between items-center text-xs text-accent">
                            <span className="flex items-center gap-1.5 font-bold"><Users className="w-3.5 h-3.5" />{onlineCount} in room</span>
                            <button
                                onClick={() => { setJoinedRoom(null); setMessages([]); setOnlineCount(0); }}
                                className="hover:underline opacity-80"
                            >
                                Leave
                            </button>
                        </div>

                        {/* Pinned Question */}
                        {pinnedQ && (
                            <div className="bg-amber-500/10 border-b border-amber-500/20 p-3 relative group">
                                <div className="flex items-center gap-2 mb-1">
                                    <Pin className="w-3.5 h-3.5 text-amber-500" />
                                    <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Question of the day</span>
                                </div>
                                <p className="text-sm font-medium">{pinnedQ}</p>
                                <button onClick={() => setPinnedQ(null)} className="absolute top-2 right-2 text-amber-500/50 hover:text-amber-500 hidden group-hover:block">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Messages View */}
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full opacity-50 text-center px-4">
                                    <MessageCircle className="w-8 h-8 mb-2" />
                                    <p className="text-sm">No messages yet.<br />Say hi or send a reaction!</p>
                                </div>
                            ) : (
                                messages.map(msg => {
                                    const isMe = msg.senderId === myLoginId.current;
                                    return (
                                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-full`}>
                                            <span className="text-[10px] text-secondary-text mb-1 px-1">{isMe ? 'You' : msg.senderName}</span>
                                            <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${isMe ? 'bg-accent text-black rounded-tr-none font-medium' : 'bg-background border border-border-subtle rounded-tl-none'}`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Toolbar (Emojis + Message) */}
                        <div className="p-3 border-t border-border-subtle bg-background flex flex-col gap-3">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-xs font-bold text-secondary-text uppercase tracking-wider">Hype</span>
                                <div className="flex gap-2">
                                    {['🚀', '🔥', '👏', '💡', '💯'].map(emoji => (
                                        <button key={emoji} onClick={() => blastEmoji(emoji)} className="w-8 h-8 rounded-full bg-secondary hover:bg-accent/20 flex items-center justify-center text-lg hover:scale-125 transition-transform">
                                            {emoji}
                                        </button>
                                    ))}
                                    <button onClick={handlePin} title="Pin a new question" className="w-8 h-8 rounded-full bg-secondary hover:bg-amber-500/20 text-secondary-text hover:text-amber-500 flex items-center justify-center transition-colors ml-2 border border-border-subtle">
                                        <Pin className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSend} className="relative">
                                <input
                                    type="text"
                                    value={inputVal}
                                    onChange={e => setInputVal(e.target.value)}
                                    placeholder="Drop a message..."
                                    className="w-full bg-secondary border border-border-subtle rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-accent text-foreground"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputVal.trim()}
                                    className="absolute right-1.5 top-1.5 p-1.5 bg-accent text-black rounded-full hover:bg-accent/90 transition-all disabled:opacity-50 disabled:bg-secondary disabled:text-secondary-text"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
