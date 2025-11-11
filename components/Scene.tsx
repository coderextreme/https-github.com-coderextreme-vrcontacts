// Fix: Add a triple-slash reference to include types for react-three-fiber JSX elements.
/// <reference types="@react-three/fiber" />
import React from 'react';
import { useSpring, a } from '@react-spring/three';
import { Html, OrbitControls, RoundedBox } from '@react-three/drei';

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
                onPointerDown={onClick}
            >
                <planeGeometry args={[0.3, 0.4]} />
                <meshStandardMaterial color={isActive ? color : '#27272a'} transparent opacity={isActive ? 0.2 : 0.5} />
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

  const animatedDetailProps = useSpring({
    position: ((selectedContact || selectedMeeting) ? [1.6, 1.6, 0] : [4, 1.6, 0]) as [number, number, number],
    scale: (selectedContact || selectedMeeting) ? 1 : 0.8,
    config: { mass: 1, tension: 220, friction: 25 }
  });
  
  // Shift the entire nav assembly up to prevent the grid from blocking clicks on the lower button.
  const NAV_Y_OFFSET = 2.4;
  const MEETINGS_BUTTON_Y = 2.0 + NAV_Y_OFFSET;
  const CONTACTS_BUTTON_Y = -2.0 + NAV_Y_OFFSET;

  const indicatorSpring = useSpring({
    y: activeView === ViewType.MEETINGS ? MEETINGS_BUTTON_Y : CONTACTS_BUTTON_Y,
    config: { mass: 1, tension: 220, friction: 25 },
  });
  
  const indicatorColor = activeView === ViewType.MEETINGS ? '#67e8f9' : '#c084fc';

  return (
    <>
      <Environment />
      <OrbitControls makeDefault />
      
      {/* Navigation Panels */}
       <RoundedBox args={[0.5, 4.6, 0.01]} radius={0.05} smoothness={4} position={[-8.5, NAV_Y_OFFSET, -0.05]}>
        <meshStandardMaterial color="#1f2937" transparent opacity={0.6} />
      </RoundedBox>

      {/* Sliding indicator for NavButtons */}
      <a.group position-x={-8.5} position-y={indicatorSpring.y} position-z={-0.04}>
        <RoundedBox args={[0.35, 0.45, 0.02]} radius={0.05} smoothness={4}>
            <meshStandardMaterial 
                color={indicatorColor}
                emissive={indicatorColor}
                emissiveIntensity={1.5}
                transparent 
                opacity={0.6}
                toneMapped={false}
            />
        </RoundedBox>
      </a.group>

      <NavButton
        onClick={() => setActiveView(ViewType.MEETINGS)}
        isActive={activeView === ViewType.MEETINGS}
        color="cyan"
        position={[-8.5, MEETINGS_BUTTON_Y, 0]}
        rotation={[0, 0, 0]}
      >
        <CalendarIcon className="h-12 w-12 mx-auto" />
        <span className="mt-2 text-lg">Meetings</span>
      </NavButton>
       <NavButton
        onClick={() => setActiveView(ViewType.CONTACTS)}
        isActive={activeView === ViewType.CONTACTS}
        color="purple"
        position={[-8.5, CONTACTS_BUTTON_Y, 0]}
        rotation={[0, 0, 0]}
      >
        <UserGroupIcon className="h-12 w-12 mx-auto" />
        <span className="mt-2 text-lg">Contacts</span>
      </NavButton>

      {/* List Panel */}
      <group position={[0, 1.6, 0]}>
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
      </group>

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