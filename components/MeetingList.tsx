import React from 'react';
import type { Meeting } from '../types';
import { ClockIcon, PlusIcon } from './IconComponents';
import ListItemWrapper from './ListItemWrapper';

interface MeetingListProps {
  meetings: Meeting[];
  selectedMeetingId: string | null;
  onSelectMeeting: (id: string) => void;
  onAddMeeting: () => void;
}

const MeetingList: React.FC<MeetingListProps> = ({ meetings, selectedMeetingId, onSelectMeeting, onAddMeeting }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-gray-700/50 flex flex-col h-full overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-700/80 flex-shrink-0">
            <h2 className="text-2xl font-bold text-cyan-300">Meetings</h2>
             <button
                onClick={onAddMeeting}
                className="p-2 rounded-full text-cyan-300 bg-cyan-500/20 hover:bg-cyan-500/40 transition-colors"
                aria-label="Add new meeting"
            >
                <PlusIcon className="h-6 w-6" />
            </button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto">
        {meetings.map((meeting) => (
            <ListItemWrapper key={meeting.id} onClick={() => onSelectMeeting(meeting.id)}>
                <div className={`w-full text-left p-3 rounded-lg transition-all duration-200 border-2 ${
                    selectedMeetingId === meeting.id
                    ? 'bg-cyan-500/30 border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'bg-gray-800/50 border-transparent group-hover:bg-cyan-500/10 group-hover:border-cyan-600/50'
                }`}>
                    <p className="font-semibold text-white">{meeting.title}</p>
                    <div className="flex items-center text-sm text-gray-400 mt-1">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        <span>{formatDate(meeting.time)}</span>
                    </div>
                </div>
            </ListItemWrapper>
        ))}
        </div>
    </div>
  );
};

export default MeetingList;