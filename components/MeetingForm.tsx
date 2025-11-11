import React, { useState, useEffect } from 'react';
import type { Meeting, Contact } from '../types';
import { Recurrence } from '../types';

interface MeetingFormProps {
    onSave: (meeting: Omit<Meeting, 'id'> & { id?: string }) => void;
    onCancel: () => void;
    meeting: Meeting | null;
    contacts: Contact[];
}

const MeetingForm: React.FC<MeetingFormProps> = ({ onSave, onCancel, meeting, contacts }) => {
    const [formData, setFormData] = useState({
        title: '',
        time: '',
        duration: 60,
        agenda: '',
        recurrence: Recurrence.NONE,
        attendees: [] as string[],
    });

    useEffect(() => {
        if (meeting) {
            setFormData({
                title: meeting.title,
                time: new Date(meeting.time.getTime() - (meeting.time.getTimezoneOffset() * 60000)).toISOString().slice(0, 16),
                duration: meeting.duration,
                agenda: meeting.agenda,
                recurrence: meeting.recurrence || Recurrence.NONE,
                attendees: meeting.attendees,
            });
        } else {
            setFormData({
                title: '',
                time: '',
                duration: 60,
                agenda: '',
                recurrence: Recurrence.NONE,
                attendees: [],
            });
        }
    }, [meeting]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'duration' ? parseInt(value, 10) : value }));
    };

    const handleAttendeeChange = (contactId: string) => {
        setFormData(prev => {
            const newAttendees = prev.attendees.includes(contactId)
                ? prev.attendees.filter(id => id !== contactId)
                : [...prev.attendees, contactId];
            return { ...prev, attendees: newAttendees };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: meeting?.id, time: new Date(formData.time) });
    };

    const inputClass = "w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-400 mb-1">Date & Time</label>
                    <input type="datetime-local" id="time" name="time" value={formData.time} onChange={handleChange} required className={inputClass} />
                </div>
                 <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-400 mb-1">Duration (minutes)</label>
                    <input type="number" id="duration" name="duration" value={formData.duration} onChange={handleChange} required min="1" className={inputClass} />
                </div>
            </div>
            <div>
                <label htmlFor="recurrence" className="block text-sm font-medium text-gray-400 mb-1">Recurrence</label>
                <select id="recurrence" name="recurrence" value={formData.recurrence} onChange={handleChange} className={inputClass}>
                    {Object.values(Recurrence).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="agenda" className="block text-sm font-medium text-gray-400 mb-1">Agenda</label>
                <textarea id="agenda" name="agenda" value={formData.agenda} onChange={handleChange} required rows={3} className={inputClass}></textarea>
            </div>
            <div>
                 <label className="block text-sm font-medium text-gray-400 mb-1">Attendees</label>
                 <div className="max-h-40 overflow-y-auto bg-gray-700 border border-gray-600 rounded-md p-2 space-y-2">
                    {contacts.map(contact => (
                        <div key={contact.id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`contact-${contact.id}`}
                                checked={formData.attendees.includes(contact.id)}
                                onChange={() => handleAttendeeChange(contact.id)}
                                className="h-4 w-4 rounded border-gray-500 bg-gray-800 text-cyan-600 focus:ring-cyan-500"
                            />
                            <label htmlFor={`contact-${contact.id}`} className="ml-3 text-sm text-gray-300">{contact.name}</label>
                        </div>
                    ))}
                 </div>
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 transition-colors text-white font-semibold">Save Meeting</button>
            </div>
        </form>
    );
};

export default MeetingForm;
