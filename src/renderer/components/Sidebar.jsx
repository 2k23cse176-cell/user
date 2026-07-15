import React, { useState } from 'react';
import { Plus, Search, Layout, Settings, LogOut, Trash2 } from 'lucide-react';

export default function Sidebar({ 
  profiles, 
  activeProfileId, 
  setActiveProfileId, 
  addProfile,
  searchQuery,
  setSearchQuery
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (newName.trim()) {
      addProfile(newName.trim());
      setNewName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="w-72 flex flex-col bg-discord-darkest h-full pt-12">
      {/* Search Header */}
      <div className="px-4 mb-4">
        <div className="relative group">
          <input
            type="text"
            placeholder="Find a session..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-discord-dark darker text-sm py-1.5 px-3 rounded outline-none focus:ring-1 focus:ring-discord-blurple transition-all"
          />
          <Search className="absolute right-2 top-2 w-4 h-4 text-discord-muted group-focus-within:text-discord-text" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
        <button
          onClick={() => setActiveProfileId(null)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
            activeProfileId === null 
            ? 'bg-discord-dark text-discord-text' 
            : 'text-discord-muted hover:bg-discord-darker hover:text-discord-text'
          }`}
        >
          <Layout className="w-5 h-5" />
          <span className="font-medium">Dashboard</span>
        </button>

        <div className="pt-4 pb-2 px-2 flex items-center justify-between">
          <span className="text-xs font-bold text-discord-muted uppercase tracking-wider">Discord Sessions</span>
          <button 
            onClick={() => setIsAdding(true)}
            className="text-discord-muted hover:text-discord-text transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleAdd} className="px-2 pb-2">
            <input
              autoFocus
              type="text"
              placeholder="Session name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={() => !newName && setIsAdding(false)}
              className="w-full bg-discord-dark darker text-sm py-1.5 px-3 rounded outline-none border border-discord-blurple"
            />
          </form>
        )}

        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => setActiveProfileId(profile.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors group relative ${
              activeProfileId === profile.id 
              ? 'bg-discord-dark text-discord-text' 
              : 'text-discord-muted hover:bg-discord-darker hover:text-discord-text'
            }`}
          >
            <div className="relative">
              <div 
                className={`w-2 h-2 rounded-full ${activeProfileId === profile.id ? 'bg-white' : 'bg-discord-green'}`}
              />
              {activeProfileId === profile.id && <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75"></div>}
            </div>
            <span className="font-medium truncate flex-1 text-left">{profile.name}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 bg-discord-darker flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-discord-blurple flex items-center justify-center text-white font-bold">
          D
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold truncate">Workspace</div>
          <div className="text-xs text-discord-muted">Manage sessions</div>
        </div>
        <button className="text-discord-muted hover:text-discord-text transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
