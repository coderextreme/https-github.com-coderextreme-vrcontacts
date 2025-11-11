import React, { useState, useCallback } from 'react';
import type { Meeting, Contact, Briefing } from '../types';
import { generateMeetingBriefing } from '../services/geminiService';
import { ClockIcon, SparklesIcon, CalendarDaysIcon, PencilIcon, TrashIcon, UserPlusIcon } from './IconComponents';
import LoadingSpinner from './LoadingSpinner';

interface MeetingDetailProps {
  meeting: Meeting;
  contacts: Contact[];
  onEdit: (meeting: Meeting) => void;
  onDelete: (meetingId: string) => void;
  onManageAttendees: (meeting: Meeting) => void;
}

const MeetingDetail: React.FC<MeetingDetailProps> = ({ meeting, contacts, onEdit, onDelete, onManageAttendees }) => {
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateBriefing = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setBriefing(null);
    try {
      const result = await generateMeetingBriefing(meeting, contacts);
      setBriefing(result);
    } catch (e) {
      setError('Failed to generate briefing. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [meeting, contacts]);
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(date);
  };

  return (
    <div className="animate-fade-in h-full flex flex-col gap-4">
      {/* Header section */}
      <div>
        <div className="flex justify-between items-start">
            <h1 className="text-4xl font-bold text-white tracking-wider">{meeting.title}</h1>
            <div className="flex gap-2 flex-shrink-0 ml-4">
                 <button 
                    onClick={() => onEdit(meeting)}
                    className="p-3 rounded-full bg-gray-700 hover:bg-cyan-500/40 text-cyan-300 transition-colors"
                    aria-label="Edit meeting"
                >
                    <PencilIcon className="h-6 w-6" />
                </button>
                <button 
                    onClick={() => onDelete(meeting.id)}
                    className="p-3 rounded-full bg-gray-700 hover:bg-red-500/40 text-red-300 transition-colors"
                    aria-label="Delete meeting"
                >
                    <TrashIcon className="h-6 w-6" />
                </button>
            </div>
        </div>
        <div className="flex items-center text-cyan-300 mt-2 space-x-4">
            <div className="flex items-center">
                <ClockIcon className="h-5 w-5 mr-2" />
                <span>{formatDate(meeting.time)} ({meeting.duration} min)</span>
            </div>
             {meeting.recurrence && meeting.recurrence !== 'Does not repeat' && (
                <div className="flex items-center">
                    <CalendarDaysIcon className="h-5 w-5 mr-2" />
                    <span>{meeting.recurrence}</span>
                </div>
             )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow min-h-0">
          {/* Left Card: Agenda & Attendees */}
          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 overflow-y-auto flex flex-col gap-4">
            {/* Agenda Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-300">Agenda</h2>
              <p className="text-gray-400 whitespace-pre-wrap mt-2">{meeting.agenda}</p>
            </div>
            {/* Attendees Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-300 flex justify-between items-center">
                <span>Attendees</span>
                <button 
                    onClick={() => onManageAttendees(meeting)}
                    className="flex items-center text-sm text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1 rounded-md transition-colors"
                    aria-label="Manage attendees"
                >
                    <UserPlusIcon className="h-5 w-5 mr-2" />
                    Manage
                </button>
              </h2>
              <div className="flex flex-wrap gap-4 mt-2">
              {contacts.map(contact => (
                  <div key={contact.id} className="flex items-center space-x-2">
                      <img src={contact.avatarUrl} alt={contact.name} className="h-10 w-10 rounded-full" />
                      <div>
                          <p className="text-sm font-medium text-white">{contact.name}</p>
                          <p className="text-xs text-gray-400">{contact.title}</p>
                      </div>
                  </div>
              ))}
              {contacts.length === 0 && <p className="text-gray-500">No attendees assigned.</p>}
              </div>
            </div>
          </div>
          
          {/* Right Card: AI Briefing */}
          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-cyan-300 flex items-center">
                    <SparklesIcon className="h-6 w-6 mr-2" />
                    AI Briefing
                </h2>
                <button 
                    onClick={handleGenerateBriefing} 
                    disabled={isLoading}
                    className="flex items-center bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex-shrink-0"
                >
                    {isLoading ? <LoadingSpinner/> : <SparklesIcon className="h-5 w-5 mr-2" />}
                    {isLoading ? 'Generating...' : 'Generate'}
                </button>
            </div>
            <div className="flex-grow overflow-y-auto pr-2">
                {error && <p className="text-red-400">{error}</p>}
                {briefing && (
                    <div className="space-y-4 text-sm">
                        <div>
                            <h3 className="font-bold text-gray-200">Summary</h3>
                            <p className="text-gray-400">{briefing.summary}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-200">Attendee Insights</h3>
                            <ul className="list-disc list-inside space-y-2 pl-2 mt-1">
                                {briefing.attendeeBriefings.map(ab => (
                                    <li key={ab.name} className="text-gray-400"><strong className="text-gray-300">{ab.name}:</strong> {ab.brief}</li>
                                ))}
                            </ul>
                        </div>
                         <div>
                            <h3 className="font-bold text-gray-200">Key Talking Points</h3>
                            <ul className="list-disc list-inside space-y-1 pl-2 mt-1">
                                {briefing.talkingPoints.map((tp, i) => (
                                    <li key={i} className="text-gray-400">{tp}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default MeetingDetail;