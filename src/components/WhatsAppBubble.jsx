import React from 'react';
import './WhatsAppBubble.css';
import { MessageSquare } from 'lucide-react';

const WhatsAppBubble = () => {
  const waLink = 'https://wa.me/1234567890'; // placeholder number
  return (
    <a href={waLink} className="whatsapp-bubble" target="_blank" rel="noopener noreferrer">
      <MessageSquare size={24} className="whatsapp-icon" />
    </a>
  );
};

export default WhatsAppBubble;
