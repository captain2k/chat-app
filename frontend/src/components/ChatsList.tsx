import { useEffect } from 'react';
import UsersLoadingSkeleton from './UsersLoadingSkeleton';
import { useChatStore } from '../stores/useChatStore';
import NoChatsFound from './NoChatsFound';
import { useAuthStore } from '../stores/authStore';

function ChatsList() {
  const { fetchChatPartnerList, chatPartnerList, isLoadingChatPartner, setSelectedPartner } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    fetchChatPartnerList();
  }, [fetchChatPartnerList]);

  if (isLoadingChatPartner) return <UsersLoadingSkeleton />;
  if (chatPartnerList.length === 0) return <NoChatsFound />;

  return (
    <>
      {chatPartnerList.map((chat) => (
        <div
          key={chat._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedPartner(chat)}
        >
          <div className="flex items-center gap-3">
            <div className={`avatar ${onlineUsers.includes(chat._id) ? 'online' : 'offline'}`}>
              <div className="size-12 rounded-full">
                <img src={chat.profilePicture || '/avatar.png'} alt={chat.fullName} />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">{chat.fullName}</h4>
          </div>
        </div>
      ))}
    </>
  );
}
export default ChatsList;
