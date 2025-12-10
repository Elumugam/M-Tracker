import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Sparkles, TrendingDown, TrendingUp, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { useStore } from '@/lib/store';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your M-Tracker assistant. I can analyze your spending, give budgeting tips, or help you find ways to save. What's on your mind?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const expenses = useStore(state => state.expenses);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(() => {
      const response = generateResponse(userMsg.content);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (query: string): string => {
    const q = query.toLowerCase();
    const totalSpent = expenses.reduce((sum, ex) => sum + ex.amount, 0);
    
    if (q.includes('total') || q.includes('spend')) {
      return `You've spent a total of ₹${totalSpent.toFixed(2)} so far. Would you like a breakdown by category?`;
    }
    if (q.includes('save') || q.includes('reduce')) {
      return "Based on your spending, here's a tip: Try setting a weekly limit for 'Entertainment'. You spent ₹15.99 on subscriptions recently. Could you consolidate them?";
    }
    if (q.includes('category') || q.includes('breakdown')) {
      // Simple mock aggregation
      return "Most of your spending is in Food and Transport. I recommend cooking at home more often!";
    }
    return "That's an interesting question regarding your finances. To give you the best advice, could you clarify if you're looking for savings tips or spending analysis?";
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-4 z-50 w-[350px] md:w-[400px]"
          >
            <Card className="shadow-2xl border-primary/20 overflow-hidden flex flex-col h-[500px] bg-background/95 backdrop-blur-md">
              {/* Header */}
              <div className="p-4 bg-primary text-primary-foreground flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-1.5 rounded-lg">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">M-Tracker AI</h3>
                    <p className="text-xs text-primary-foreground/80">Financial Assistant</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 hover:bg-white/20 text-primary-foreground" 
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Chat Area */}
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-none'
                            : 'bg-muted text-foreground rounded-bl-none'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-none flex gap-1">
                        <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce delay-75" />
                        <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce delay-150" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-3 border-t bg-background/50">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex gap-2"
                >
                  <Input 
                    placeholder="Ask about your spending..." 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="rounded-full bg-background border-primary/10 focus-visible:ring-primary"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="rounded-full shrink-0"
                    disabled={!inputValue.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg shadow-primary/30 transition-colors ${
          isOpen ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </motion.button>
    </>
  );
}
