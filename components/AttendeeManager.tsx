import React, { useState } from 'react';
import type { Meeting, Contact } from '../types';

interface AttendeeManagerProps {
    meeting: Meeting;
    allContacts: Contact[];
    onSave: (meetingId: string, attendeeIds: string[]) => void;
    onCancel: () => void;
}

const AttendeeManager: React.FC<AttendeeManagerProps> = ({ meeting, allContacts, onSave, onCancel }) => {
    const [selectedIds, setSelectedIds] = useState<string[]>(meeting.attendees);

    const handleToggle = (contactId: string) => {
        setSelectedIds(prev =>
            prev.includes(contactId)
                ? prev.filter(id => id !== contactId)
                : [...prev, contactId]
        );
    };

    const handleSave = () => {
        onSave(meeting.id, selectedIds);
    };

    return (
        <div className="space-y-4">
            <p className="text-gray-400">Select contacts to invite to "{meeting.title}".</p>
            <div className="max-h-64 overflow-y-auto bg-gray-900/50 border border-gray-700 rounded-md p-3 space-y-2">
                {allContacts.length > 0 ? allContacts.map(contact => (
                    <div key={contact.id} className="flex items-center p-2 rounded-md hover:bg-gray-700/50 transition-colors">
                        <input
                            type="checkbox"
                            id={`attendee-${contact.id}`}
                            checked={selectedIds.includes(contact.id)}
                            onChange={() => handleToggle(contact.id)}
                            className="h-5 w-5 rounded border-gray-500 bg-gray-800 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                        />
                        <label htmlFor={`attendee-${contact.id}`} className="ml-3 flex items-center space-x-3 cursor-pointer flex-grow">
                             <img src={contact.avatarUrl} alt={contact.name} className="h-10 w-10 rounded-full" />
                             <div>
                                <span className="text-gray-200 font-medium">{contact.name}</span>
                                <p className="text-xs text-gray-400">{contact.title}</p>
                            </div>
                        </label>
                    </div>
                )) : (
                    <p className="text-gray-500 text-center p-4">No contacts available to add.</p>
                )}
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">Cancel</button>
                <button type="button" onClick={handleSave} className="px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 transition-colors text-white font-semibold">Update Attendees</button>
            </div>
        </div>
    );
};

export default AttendeeManager;
