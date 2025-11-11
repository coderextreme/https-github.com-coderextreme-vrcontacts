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

type NavItemData = {
    view: ViewType;
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    color: 'cyan' | 'purple';
};

const NavItem = ({ item, isActive, onClick, yPos }: {
    item: NavItemData;
    isActive: boolean;
    onClick: () => void;
    yPos: number;
}) => {
    const { icon: Icon, label, color } = item;
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
        <a.group position={[0, yPos, 0]} scale={spring.scale}>
            <mesh
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                onPointerDown={(e) => { e.stopPropagation(); onClick(); }}
            >
                <planeGeometry args={[0.3, 0.4]} />
                <meshStandardMaterial 
                    key={isActive ? color : 'inactive'}
                    color={isActive ? color : '#27272a'} 
                    transparent 
                    opacity={isActive ? 0.2 : 0.5} 
                />
            </mesh>
            <Html center position={[0, 0, 0.01]} transform>
                <div className={`p-4 rounded-lg w-[120px] h-[160px] flex flex-col items-center justify-center pointer-events-none transition-all duration-300 border-2 ${currentClasses}`}>
                    <Icon className="h-12 w-12 mx-auto" />
                    <span className="mt-2 text-lg">{label}</span>
                </div>
            </Html>
        </a.group>
    )
}

const NAV_LIST_Y_OFFSET = 1.6;
const NAV_ITEM_SPACING = 0.5;

const NavButtonList = ({ items, activeView, onSelectView }: {
    items: NavItemData[];
    activeView: ViewType;
    onSelectView: (view: ViewType) => void;
}) => {
    const activeIndex = items.findIndex(item => item.view === activeView);
    
    // This calculation centers the list of items around y=0 of the group
    const yOffsetFromCenter = (items.length - 1) * NAV_ITEM_SPACING / 2;
    const indicatorY = yOffsetFromCenter - (activeIndex * NAV_ITEM_SPACING);

    const indicatorSpring = useSpring({
        y: indicatorY,
        config: { mass: 1, tension: 220, friction: 25 },
    });
    
    const indicatorColor = items[activeIndex]?.color === 'cyan' ? '#67e8f9' : '#c084fc';
    const panelHeight = (items.length * 0.4) + ((items.length - 1) * 0.1) + 0.2; // 0.4*2 + 0.1 gap + 0.2 padding

    return (
        <group position={[-1.5, NAV_LIST_Y_OFFSET, 0]}>
            {/* Background Panel */}
            <RoundedBox args={[0.5, panelHeight, 0.01]} radius={0.05} smoothness={4} position={[0, 0, -0.05]}>
                <meshStandardMaterial color="#1f2937" transparent opacity={0.6} />
            </RoundedBox>

            {/* Sliding indicator */}
            <a.group position-x={0} position-y={indicatorSpring.y} position-z={-0.04}>
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

            {/* Navigation Items */}
            {items.map((item, index) => {
                 const yPos = yOffsetFromCenter - (index * NAV_ITEM_SPACING);
                 return (
                    <NavItem 
                        key={item.view}
                        item={item}
                        isActive={activeView === item.view}
                        onClick={() => onSelectView(item.view)}
                        yPos={yPos}
                    />
                 )
            })}
        </group>
    );
};


const Scene: React.FC<SceneProps> = (props) => {
  const { activeView, selectedContact, selectedMeeting } = props;

  const animatedDetailProps = useSpring({
    position: ((selectedContact || selectedMeeting) ? [1.6, 1.6, 0] : [4, 1.6, 0]) as [number, number, number],
    scale: (selectedContact || selectedMeeting) ? 1 : 0.8,
    config: { mass: 1, tension: 220, friction: 25 }
  });

  const navItems: NavItemData[] = [
    { view: ViewType.MEETINGS, label: 'Meetings', icon: CalendarIcon, color: 'cyan' },
    { view: ViewType.CONTACTS, label: 'Contacts', icon: UserGroupIcon, color: 'purple' }
  ];

  return (
    <>
      <Environment />
      <OrbitControls makeDefault />
      
      <NavButtonList 
        items={navItems}
        activeView={activeView}
        onSelectView={props.setActiveView}
      />

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