import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
// Fix: Replaced `Controllers` with `DefaultXRControllers` which is the correct export for newer versions of `@react-three/xr`. This resolves all three reported errors.
import { XR, DefaultXRControllers, VRButton } from '@react-three/xr';
import { CONTACTS, MEETINGS } from './constants';
import type { Contact, Meeting } from './types';
import { ViewType } from './types';
import Scene from './components/Scene';
import Modal from './components/Modal';
import ContactForm from './components/ContactForm';
import MeetingForm from './components/MeetingForm';

const App: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(CONTACTS);
  const [meetings, setMeetings] = useState<Meeting[]>(MEETINGS);

  const [activeView, setActiveView] = useState<ViewType>(ViewType.MEETINGS);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(meetings[0]?.id || null);

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);

  // Contact Handlers
  const handleAddContact = () => {
    setEditingContact(null);
    setIsContactModalOpen(true);
  };
  
  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsContactModalOpen(true);
  };

  const handleSaveContact = (contact: Omit<Contact, 'id' | 'avatarUrl'> & { id?: string }) => {
    if (contact.id) { // Update
      setContacts(contacts.map(c => c.id === contact.id ? { ...c, ...contact } : c));
    } else { // Create
      const newContact: Contact = {
        ...contact,
        id: crypto.randomUUID(),
        avatarUrl: `https://picsum.photos/seed/${crypto.randomUUID()}/200`,
      };
      setContacts([...contacts, newContact]);
    }
    setIsContactModalOpen(false);
    setEditingContact(null);
  };

  const handleDeleteContact = (contactId: string) => {
    if (window.confirm("Are you sure you want to delete this contact? They will be removed from all meetings.")) {
        setContacts(contacts.filter(c => c.id !== contactId));
        setMeetings(meetings.map(m => ({
            ...m,
            attendees: m.attendees.filter(id => id !== contactId)
        })));
        if (selectedContactId === contactId) {
            setSelectedContactId(null);
        }
    }
  };


  // Meeting Handlers
  const handleAddMeeting = () => {
    setEditingMeeting(null);
    setIsMeetingModalOpen(true);
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setIsMeetingModalOpen(true);
  };

  const handleSaveMeeting = (meeting: Omit<Meeting, 'id'> & { id?: string }) => {
     if (meeting.id) { // Update
        setMeetings(meetings.map(m => m.id === meeting.id ? { ...m, ...meeting } : m));
    } else { // Create
        const newMeeting: Meeting = {
            ...meeting,
            id: crypto.randomUUID(),
        };
        setMeetings([...meetings, newMeeting]);
    }
    setIsMeetingModalOpen(false);
    setEditingMeeting(null);
  }

  const handleDeleteMeeting = (meetingId: string) => {
    if(window.confirm("Are you sure you want to delete this meeting?")) {
        setMeetings(meetings.filter(m => m.id !== meetingId));
        if (selectedMeetingId === meetingId) {
            setSelectedMeetingId(null);
        }
    }
  };


  // Selection Handlers
  const handleSelectContact = (id: string) => {
    setSelectedContactId(id);
    setSelectedMeetingId(null);
    setActiveView(ViewType.CONTACTS);
  };

  const handleSelectMeeting = (id: string) => {
    setSelectedMeetingId(id);
    setSelectedContactId(null);
    setActiveView(ViewType.MEETINGS);
  };

  const selectedContact = contacts.find(c => c.id === selectedContactId);
  const selectedMeeting = meetings.find(m => m.id === selectedMeetingId);
  const meetingContacts = selectedMeeting ? selectedMeeting.attendees.map(id => contacts.find(c => c.id === id)).filter(Boolean) as Contact[] : [];


  return (
    <>
      <VRButton />
      <Canvas camera={{ position: [0, 1.6, 0] }}>
        <XR>
          {/* Fix: Use the `DefaultXRControllers` component. */}
          <DefaultXRControllers />
          <Scene
            contacts={contacts}
            meetings={meetings}
            activeView={activeView}
            setActiveView={setActiveView}
            selectedContactId={selectedContactId}
            selectedMeetingId={selectedMeetingId}
            handleSelectContact={handleSelectContact}
            handleSelectMeeting={handleSelectMeeting}
            handleAddContact={handleAddContact}
            handleAddMeeting={handleAddMeeting}
            selectedContact={selectedContact}
            selectedMeeting={selectedMeeting}
            meetingContacts={meetingContacts}
            handleEditContact={handleEditContact}
            handleDeleteContact={handleDeleteContact}
            handleEditMeeting={handleEditMeeting}
            handleDeleteMeeting={handleDeleteMeeting}
          />
        </XR>
      </Canvas>

      {/* Modals remain in the 2D DOM, overlaying the canvas */}
      <Modal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} title={editingContact ? 'Edit Contact' : 'Add Contact'}>
        <ContactForm 
            onSave={handleSaveContact} 
            onCancel={() => setIsContactModalOpen(false)}
            contact={editingContact}
        />
      </Modal>

       <Modal isOpen={isMeetingModalOpen} onClose={() => setIsMeetingModalOpen(false)} title={editingMeeting ? 'Edit Meeting' : 'Add Meeting'}>
        <MeetingForm
            onSave={handleSaveMeeting}
            onCancel={() => setIsMeetingModalOpen(false)}
            meeting={editingMeeting}
            contacts={contacts}
        />
      </Modal>
    </>
  );
};

export default App;