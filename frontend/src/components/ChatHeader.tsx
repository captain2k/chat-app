import { XIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useChatStore } from '../stores/useChatStore';
import { useAuthStore } from '../stores/authStore';

function ChatHeader() {
  const { selectedPartner, setSelectedPartner } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedPartner._id);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') setSelectedPartner(null);
    };

    window.addEventListener('keydown', handleEscKey);

    // cleanup function
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [setSelectedPartner]);

  return (
    <div
      className="flex justify-between items-center bg-slate-800/50 border-b
   border-slate-700/50 max-h-[84px] px-6 flex-1"
    >
      <div className="flex items-center space-x-3">
        <div className={`avatar ${isOnline ? 'online' : 'offline'}`}>
          <div className="w-12 rounded-full">
            <img
              src={selectedPartner.profilePicture || '/avatar.png'}
              alt={selectedPartner.fullName}
            />
          </div>
        </div>

        <div>
          <h3 className="text-slate-200 font-medium">{selectedPartner.fullName}</h3>
          <p className="text-slate-400 text-sm">{isOnline ? 'Online' : 'Offline'}</p>
        </div>
      </div>

      <button onClick={() => setSelectedPartner(null)}>
        <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
      </button>
    </div>
  );
}
export default ChatHeader;
