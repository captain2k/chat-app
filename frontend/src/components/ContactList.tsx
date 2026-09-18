import { useEffect } from 'react';
import UsersLoadingSkeleton from './UsersLoadingSkeleton';
import { useChatStore } from '../stores/useChatStore';
import { useAuthStore } from '../stores/authStore';

function ContactList() {
  const { fetchContactList, allContacts, setSelectedPartner, isLoadingContacts } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    fetchContactList();
  }, [fetchContactList]);

  if (isLoadingContacts) return <UsersLoadingSkeleton />;

  return (
    <>
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedPartner(contact)}
        >
          <div className="flex items-center gap-3">
            <div className={`avatar ${onlineUsers.includes(contact._id) ? 'online' : 'offline'}`}>
              <div className="size-12 rounded-full">
                <img src={contact.profilePicture || '/avatar.png'} />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium">{contact.fullName}</h4>
          </div>
        </div>
      ))}
    </>
  );
}
export default ContactList;
