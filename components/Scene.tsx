// Fix: Add a triple-slash reference to include types for react-three-fiber JSX elements.
/// <reference types="@react-three/fiber" />
import React, { useMemo } from 'react';
import { useSpring, a } from '@react-spring/three';
import { Html, OrbitControls } from '@react-three/drei';

import type { Contact, Meeting } from '../types';
import { ViewType } from '../types';
import { UserGroupIcon, CalendarIcon } from './IconComponents';

import Environment from './Environment';
import ContactList from './ContactList';
import MeetingList from './MeetingList';
import ContactDetail from './ContactDetail';
import MeetingDetail from './MeetingDetail';

const PANEL_WIDTH = 1.2;
const PANEL_HEIGHT = 2;

interface SceneProps {
  contacts: Contact[];
  meetings: Meeting[];
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  selectedContactId: string | null;
  selectedMeetingId: string | null;
  handleSelectContact: (id: string) => void;
  handleSelectMeeting: (id: string) => void;
  handleAddContact: () => void;
  handleAddMeeting: () => void;
  selectedContact: Contact | null;
  selectedMeeting: Meeting | null;
  meetingContacts: Contact[];
  handleEditContact: (contact: Contact) => void;
  handleDeleteContact: (id: string) => void;
  handleEditMeeting: (meeting: Meeting) => void;
  handleDeleteMeeting: (id: string) => void;
  handleManageAttendees: (meeting: Meeting) => void;
}

const NavButton = ({ onClick, isActive, children, color, position, rotation }: {
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
    color: 'cyan' | 'purple';
    position: [number, number, number];
    rotation: [number, number, number];
}) => {
    const [spring, api] = useSpring(() => ({
        scale: 1,
        config: { mass: 1, tension: 200, friction: 20 }
    }));

    const handlePointerOver = () => api.start({ scale: 1.15 });
    const handlePointerOut = () => api.start({ scale: 1 });
    
    const activeClasses = {
      cyan: 'bg-cyan-500/30 border-cyan-400',
      purple: 'bg-purple-500/30 border-purple-400',
    };
    const inactiveClasses = 'bg-gray-800/50 border-gray-700';
    const currentClasses = isActive ? activeClasses[color] : inactiveClasses;

    return (
        <a.group position={position} rotation={rotation} scale={spring.scale}>
            <mesh
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                onClick={onClick}
            >
                <planeGeometry args={[0.3, 0.4]} />
                <meshStandardMaterial color={isActive ? color : '#27272a'} transparent opacity={0.5} />
            </mesh>
            <Html center position={[0, 0, 0.01]} transform>
                <div className={`p-4 rounded-lg w-[120px] h-[160px] flex flex-col items-center justify-center pointer-events-none transition-all duration-300 border-2 ${currentClasses}`}>
                    {children}
                </div>
            </Html>
        </a.group>
    )
}


const Scene: React.FC<SceneProps> = (props) => {
  const { activeView, setActiveView, selectedContact, selectedMeeting } = props;

  const { listSpring, detailSpring } = useMemo(() => {
    const hasSelection = !!selectedContact || !!selectedMeeting;
    
    // Animate list panel to the left if a detail is showing
    // FIX: Explicitly cast arrays as tuples to prevent TypeScript from widening them to number[].
    // This ensures react-spring creates the correct SpringValue type for react-three-fiber.
    const listSpring = {
        position: (hasSelection ? [-1, 1.6, -2] : [ -0.7, 1.6, -1.8 ]) as [number, number, number],
        rotation: (hasSelection ? [0, 0.4, 0] : [0, 0.2, 0]) as [number, number, number],
    };
    
    // Animate detail panel in from the right
    const detailSpring = {
        position: (hasSelection ? [0.9, 1.6, -1.9] : [2, 1.6, -2]) as [number, number, number],
        rotation: (hasSelection ? [0, -0.25, 0] : [0, -0.5, 0]) as [number, number, number],
        scale: hasSelection ? 1 : 0.8,
    };
    return { listSpring, detailSpring };
  }, [selectedContact, selectedMeeting]);

  const animatedListProps = useSpring(listSpring);
  const animatedDetailProps = useSpring(detailSpring);
  

  return (
    <>
      <Environment />
      <OrbitControls makeDefault />
      
      {/* Navigation Panels */}
      <NavButton
        onClick={() => setActiveView(ViewType.MEETINGS)}
        isActive={activeView === ViewType.MEETINGS}
        color="cyan"
        position={[-2.2, 1.8, -1.8]}
        rotation={[0, 0.6, 0]}
      >
        <CalendarIcon className="h-12 w-12 mx-auto" />
        <span className="mt-2 text-lg">Meetings</span>
      </NavButton>
       <NavButton
        onClick={() => setActiveView(ViewType.CONTACTS)}
        isActive={activeView === ViewType.CONTACTS}
        color="purple"
        position={[-2.2, 1.2, -1.8]}
        rotation={[0, 0.6, 0]}
      >
        <UserGroupIcon className="h-12 w-12 mx-auto" />
        <span className="mt-2 text-lg">Contacts</span>
      </NavButton>

      {/* List Panel */}
      <a.group {...animatedListProps}>
         <mesh>
            <planeGeometry args={[PANEL_WIDTH, PANEL_HEIGHT]} />
            <meshStandardMaterial transparent opacity={0} />
            <Html
              transform
              occlude
              className="w-[480px] h-[800px] html-content"
              position={[0, 0, 0.01]}
            >
              {activeView === ViewType.CONTACTS ? (
                <ContactList
                  contacts={props.contacts}
                  selectedContactId={props.selectedContactId}
                  onSelectContact={props.handleSelectContact}
                  onAddContact={props.handleAddContact}
                />
              ) : (
                <MeetingList
                  meetings={props.meetings}
                  selectedMeetingId={props.selectedMeetingId}
                  onSelectMeeting={props.handleSelectMeeting}
                  onAddMeeting={props.handleAddMeeting}
                />
              )}
            </Html>
        </mesh>
      </a.group>

      {/* Detail Panel */}
      <a.group {...animatedDetailProps}>
        <mesh>
             <planeGeometry args={[PANEL_WIDTH * 1.5, PANEL_HEIGHT]} />
             <meshStandardMaterial transparent opacity={0} />
              <Html
                transform
                occlude
                className="w-[720px] h-[800px] html-content"
                position={[0, 0, 0.01]}
            >
                <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 h-full">
                {selectedContact && activeView === ViewType.CONTACTS && (
                    <ContactDetail contact={selectedContact} onEdit={props.handleEditContact} onDelete={props.handleDeleteContact} />
                )}
                {selectedMeeting && activeView === ViewType.MEETINGS && (
                    <MeetingDetail 
                        meeting={selectedMeeting} 
                        contacts={props.meetingContacts} 
                        onEdit={props.handleEditMeeting} 
                        onDelete={props.handleDeleteMeeting}
                        onManageAttendees={props.handleManageAttendees}
                    />
                )}
                {!selectedContact && !selectedMeeting && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400 text-lg">Select an item to see details</p>
                    </div>
                )}
                </div>
            </Html>
        </mesh>
      </a.group>
    </>
  );
};

export default Scene;