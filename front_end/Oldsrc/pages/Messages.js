import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as signalR from '@microsoft/signalr';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUser, FaPaperclip, FaMicrophone, FaEllipsisV, FaCheck, FaCheckDouble, FaSearch } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { BiArrowBack } from 'react-icons/bi';
import '../styles/Messages.css';
// done
const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiverId, setReceiverId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connection, setConnection] = useState(null);
  const [forceRefresh, setForceRefresh] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { receiverId: routeReceiverId } = useParams();

  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const userId = localStorage.getItem('userId');

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const connectToHub = async () => {
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(`http://localhost:44357/chathub?userId=${userId}`)
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      newConnection.onclose(() => {
        console.log('Connection closed. Reconnecting...');
        setTimeout(() => connectToHub(), 5000);
      });

      try {
        await newConnection.start();
        console.log('Connected to SignalR');
        setConnection(newConnection);

        newConnection.on('ReceiveMessage', (message) => {
          console.log('New message received:', message);

          setConversations(prev => {
            const existingConv = prev.find(c => c.userId === message.senderId);
            if (!existingConv) {
              return [...prev, {
                userId: message.senderId,
                userName: message.senderName || 'New User',
                lastMessage: message,
                unreadCount: 1
              }];
            }
            return prev.map(c => 
              c.userId === message.senderId 
                ? { ...c, lastMessage: message, unreadCount: c.userId === receiverId ? 0 : c.unreadCount + 1 }
                : c
            );
          });

          if (Number(receiverId) === Number(message.senderId)) {
            setMessages(prev => [...prev, message]);
            markMessagesAsRead(message.senderId);
          }
        });

        newConnection.on('RefreshConversation', () => {
          console.log('Refresh conversation request received');
          setForceRefresh(prev => !prev);
        });

      } catch (err) {
        console.error('SignalR connection error:', err);
        setTimeout(() => connectToHub(), 5000);
      }
    };

    connectToHub();

    return () => {
      if (connection) {
        connection.off('ReceiveMessage');
        connection.off('RefreshConversation');
        connection.stop();
      }
    };
  }, [userId, navigate, receiverId]);

  const markMessagesAsRead = async (senderId) => {
    try {
      await axios.post(`http://localhost:44357/api/Message/mark-as-read`, {
        userId: Number(userId),
        senderId: Number(senderId)
      });
      setConversations(prev => 
        prev.map(c => 
          c.userId === senderId 
            ? { ...c, unreadCount: 0 } 
            : c
        )
      );
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await axios.get(`http://localhost:44357/api/Message/${userId}/conversations`, {
        params: { _: new Date().getTime() }
      });
      setConversations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchConversations();
  }, [userId, forceRefresh]);

  const fetchMessages = async () => {
    if (!receiverId || !userId) return;
    try {
      const res = await axios.get(`http://localhost:44357/api/Message/${userId}/conversation/${receiverId}`, {
        params: { _: new Date().getTime() }
      });
      setMessages(res.data);
      if (res.data.length > 0) {
        markMessagesAsRead(receiverId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 1000); 
    return () => clearInterval(interval);
  }, [receiverId, userId, forceRefresh]);

  useEffect(() => {
    if (shouldScrollToBottom) scrollToBottom('smooth');
  }, [messages, shouldScrollToBottom]);

  useEffect(() => {
    if (routeReceiverId) setReceiverId(routeReceiverId);
  }, [routeReceiverId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !receiverId) return;
  
    const tempId = Date.now();
    const tempMessage = {
      id: tempId,
      senderId: Number(userId),
      receiverId: Number(receiverId),
      content: newMessage,
      timestamp: new Date().toISOString(),
      isLocal: true,
      isRead: false
    };
  
  
    try {
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');
      setShouldScrollToBottom(true);
  
      const messageDto = {
        senderId: userId,
        receiverId,
        content: newMessage
      };
  
      const response = await axios.post(
        `http://localhost:44357/api/Message/${userId}/create-message/${receiverId}`,
        messageDto
      );
  
      if (connection) {
        await connection.invoke("SendMessage", Number(userId), {
          senderId: Number(userId),
          receiverId: Number(receiverId),
          content: newMessage
        }, Number(receiverId));
  
        await connection.invoke("NotifyUserToRefresh", Number(receiverId));
      }
  
      setMessages(prev => prev.map(msg =>
        msg.id === tempId ? { ...response.data, isRead: false } : msg
      ));
  
      setConversations(prev =>
        prev.map(c =>
          c.userId === Number(receiverId)
            ? { ...c, lastMessage: { ...response.data, isRead: false } }
            : c
        )
      );
    } catch (err) {
      console.error('Message sending error:', err);
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    }
  };
  

  const filteredConversations = conversations.filter(conv =>
    conv.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="whatsapp-app">
      <div className={`sidebar ${receiverId ? 'mobile-hidden' : ''}`}>
        <div className="sidebar-header">
          <div className="user-avatar">
            <FaUser className="avatar-icon" />
          </div>
          <div className="sidebar-actions">
          </div>
        </div>
        
        <div className="search-container">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search or start new chat" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="conversations-list">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <div
                key={conv.userId}
                className={`conversation-item ${selectedConversation?.userId === conv.userId ? 'active' : ''}`}
                onClick={() => {
                  setReceiverId(conv.userId);
                  setSelectedConversation(conv);
                  setShouldScrollToBottom(true);
                }}
              >
                <div className="conversation-avatar">
                  <FaUser className="avatar-icon" />
                </div>
                <div className="conversation-details">
                  <div className="conversation-header">
                    <span className="conversation-name">{conv.userName}</span>
                    <span className="conversation-time">
                      {conv.lastMessage && new Date(conv.lastMessage.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="conversation-preview">
                    <p className="preview-text">
                      {conv.lastMessage && (
                        <>
                          {conv.lastMessage.senderId === Number(userId) && (
                            <span className="message-status">
                              {conv.lastMessage.isRead ? (
                                <FaCheckDouble className="read-icon" />
                              ) : (
                                <FaCheck className="sent-icon" />
                              )}
                            </span>
                          )}
                          {conv.lastMessage.content.length > 25
                            ? conv.lastMessage.content.substring(0, 25) + '...'
                            : conv.lastMessage.content}
                        </>
                      )}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="unread-badge">{conv.unreadCount}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-conversations">
              {searchTerm ? 'No matching conversations' : 'No conversations yet'}
            </div>
          )}
        </div>
      </div>

      {receiverId ? (
        <div className="chat-area">
          <div className="chat-header">
            <div className="header-left">
              <BiArrowBack 
                className="back-button mobile-only" 
                onClick={() => setReceiverId(null)} 
              />
              <div className="chat-avatar">
                <FaUser className="avatar-icon" />
              </div>
              <div className="chat-info">
                <span className="chat-name">{selectedConversation?.userName || 'Chat'}</span>
                <span className="chat-status">online</span>
              </div>
            </div>
            <div className="header-right">
            </div>
          </div>

          <div 
            className="messages-container" 
            ref={messagesContainerRef}
            onScroll={() => {
              const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
              const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
              setShouldScrollToBottom(isNearBottom);
            }}
          >
            {messages.length > 0 ? (
              <div className="messages-list">
                {messages.map((msg) => (
                  <div
                    key={msg.id || msg.timestamp}
                    className={`message ${msg.senderId === Number(userId) ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <p>{msg.content}</p>
                      <div className="message-meta">
                        <span className="message-time">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {msg.senderId === Number(userId) && (
                          <span className="message-status">
                            {msg.isRead ? (
                              <FaCheckDouble className="read-icon" />
                            ) : (
                              <FaCheck className="sent-icon" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="no-messages">
                <p>No messages in this conversation</p>
              </div>
            )}
          </div>

          <div className="message-input-container">
            <form onSubmit={handleSendMessage} className="message-form">
              <div className="input-actions">
              </div>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
                className="message-input"
              />
              <button type="submit" className="send-button">
                <IoMdSend className="send-icon" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="welcome-screen">
          <div className="welcome-content">
            <div className="welcome-avatar">
              <FaUser className="avatar-icon large" />
            </div>
            <h2>Nestino Web</h2>
            <p>Send and receive messages without keeping your phone online.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;