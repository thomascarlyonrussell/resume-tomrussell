/**
 * ChatWidget Component
 *
 * Main chat widget container that toggles between collapsed and expanded states.
 * Fixed position at center-bottom of the viewport.
 */

'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChatButton } from './ChatButton';
import { ChatWindow } from './ChatWindow';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <ChatWindow key="window" onClose={handleClose} />
        ) : (
          <ChatButton key="button" onClick={handleOpen} />
        )}
      </AnimatePresence>
    </div>
  );
}
