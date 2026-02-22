import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function MessagesPage() {
  const { currentUser, getConversationsForUser, sendMessage, listings } = useApp();
  const conversations = getConversationsForUser(currentUser?.id);
  const [selectedConvo, setSelectedConvo] = useState(conversations[0] || null);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConvo) return;
    const listingId = selectedConvo.messages[0]?.listingId;
    sendMessage(selectedConvo.otherUserId, listingId, newMessage.trim());
    setNewMessage('');
    // Re-fetch conversations to get new message
    const updated = getConversationsForUser(currentUser?.id);
    const updatedConvo = updated.find(c => c.otherUserId === selectedConvo.otherUserId);
    if (updatedConvo) setSelectedConvo(updatedConvo);
  };

  const getListingTitle = (msgs) => {
    const listingId = msgs[0]?.listingId;
    const listing = listings.find(l => l.id === listingId);
    return listing?.title || 'Unknown Listing';
  };

  return (
    <div>
      <h4 className="fw-bold mb-4">Messages</h4>

      <div className="card border-0 shadow-sm">
        <div className="row g-0" style={{ minHeight: 500 }}>
          {/* Conversation List */}
          <div className="col-md-4 border-end">
            <div className="p-3 border-bottom">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white"><i className="fa-solid fa-magnifying-glass text-muted"></i></span>
                <input type="text" className="form-control border-start-0" placeholder="Search messages..." />
              </div>
            </div>
            <div className="conversation-list" style={{ maxHeight: 450, overflowY: 'auto' }}>
              {conversations.length === 0 ? (
                <div className="text-center text-muted p-4">
                  <i className="fa-regular fa-comments fs-1 mb-2 d-block"></i>
                  <p className="small">No conversations yet</p>
                </div>
              ) : (
                conversations.map(convo => (
                  <div
                    key={convo.otherUserId}
                    className={`d-flex align-items-center gap-2 p-3 border-bottom conversation-item ${selectedConvo?.otherUserId === convo.otherUserId ? 'bg-light' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedConvo(convo)}
                  >
                    <div className="position-relative">
                      <img
                        src={convo.otherUser?.profileImage}
                        alt=""
                        className="rounded-circle"
                        width="40"
                        height="40"
                      />
                      {convo.unreadCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                          {convo.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <div className="d-flex justify-content-between">
                        <strong className="small">{convo.otherUser?.firstName} {convo.otherUser?.lastName}</strong>
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                          {new Date(convo.lastMessage.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </small>
                      </div>
                      <p className="text-muted small mb-0 text-truncate">
                        {convo.lastMessage.senderId === currentUser?.id ? 'You: ' : ''}
                        {convo.lastMessage.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="col-md-8 d-flex flex-column">
            {selectedConvo ? (
              <>
                {/* Chat Header */}
                <div className="p-3 border-bottom d-flex align-items-center gap-2">
                  <img src={selectedConvo.otherUser?.profileImage} alt="" className="rounded-circle" width="36" height="36" />
                  <div>
                    <strong className="small">{selectedConvo.otherUser?.firstName} {selectedConvo.otherUser?.lastName}</strong>
                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                      Re: {getListingTitle(selectedConvo.messages)}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-grow-1 p-3" style={{ overflowY: 'auto', maxHeight: 350 }}>
                  {selectedConvo.messages.map(msg => {
                    const isMine = msg.senderId === currentUser?.id;
                    return (
                      <div key={msg.id} className={`d-flex mb-3 ${isMine ? 'justify-content-end' : ''}`}>
                        <div className={`p-2 px-3 rounded-3 ${isMine ? 'bg-maroon text-white' : 'bg-light'}`} style={{ maxWidth: '70%' }}>
                          <p className="mb-0 small">{msg.content}</p>
                          <small className={`${isMine ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.65rem' }}>
                            {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </small>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input */}
                <div className="p-3 border-top">
                  <form onSubmit={handleSend} className="d-flex gap-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                    />
                    <button type="submit" className="btn btn-maroon">
                      <i className="fa-solid fa-paper-plane"></i>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="d-flex align-items-center justify-content-center flex-grow-1 text-muted">
                <div className="text-center">
                  <i className="fa-regular fa-comments fs-1 mb-2 d-block"></i>
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
