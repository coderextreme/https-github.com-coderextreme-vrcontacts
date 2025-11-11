import React from 'react';
import type { Contact } from '../types';
import { PlusIcon } from './IconComponents';
import ListItemWrapper from './ListItemWrapper';

interface ContactListProps {
  contacts: Contact[];
  selectedContactId: string | null;
  onSelectContact: (id: string) => void;
  onAddContact: () => void;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, selectedContactId, onSelectContact, onAddContact }) => {
  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-gray-700/50 flex flex-col h-full overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-700/80 flex-shrink-0">
            <h2 className="text-2xl font-bold text-purple-300">Contacts</h2>
            <button
                onClick={onAddContact}
                className="p-2 rounded-full text-purple-300 bg-purple-500/20 hover:bg-purple-500/40 transition-colors"
                aria-label="Add new contact"
            >
                <PlusIcon className="h-6 w-6" />
            </button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto">
            {contacts.map((contact) => (
               <ListItemWrapper key={contact.id} onClick={() => onSelectContact(contact.id)}>
                    <div className={`w-full text-left p-3 rounded-lg transition-all duration-200 border-2 ${
                        selectedContactId === contact.id
                        ? 'bg-purple-500/30 border-purple-400 shadow-lg shadow-purple-500/20'
                        : 'bg-gray-800/50 border-transparent group-hover:bg-purple-500/10 group-hover:border-purple-600/50'
                    }`}>
                        <div className="flex items-center space-x-4">
                            <img src={contact.avatarUrl} alt={contact.name} className="h-12 w-12 rounded-full border-2 border-purple-400/50" />
                            <div>
                                <p className="font-semibold text-white">{contact.name}</p>
                                <p className="text-sm text-gray-400">{contact.title}</p>
                            </div>
                        </div>
                    </div>
                </ListItemWrapper>
            ))}
        </div>
    </div>
  );
};

export default ContactList;