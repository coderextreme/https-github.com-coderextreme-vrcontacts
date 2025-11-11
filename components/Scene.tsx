// Fix: Add a triple-slash reference to include types for react-three-fiber JSX elements.
/// <reference types="@react-three/fiber" />
import React from 'react';
import { useSpring, a } from '@react-spring/three';
import { useSpring as useSpringWeb, a as aWeb } from '@react-spring/web';
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

type NavItemData = {
    view: ViewType;
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    color: 'cyan' | 'purple';
};

// --- DOM-based Nav Components ---

const NavItem = ({ item, isActive, onClick }: {
    item: NavItemData;
    isActive: boolean;
    onClick: () => void;
}) => {
    const { icon: Icon, label, color } = item;

    const [spring, api] = useSpringWeb(() => ({
        scale: 1,
        config: { mass: 1, tension: 200, friction: 20 }
    }));

    const handlePointerOver = () => api.start({ scale: 1.1 });
    const handlePointerOut = () => api.start({ scale: 1 });
    
    const activeClasses = {
      cyan: 'bg-cyan-500/30 border-cyan-400 text-cyan-200',
      purple: 'bg-purple-500/30 border-purple-400 text-purple-200',
    };
    const inactiveClasses = 'bg-gray-800/50 border-gray-700 hover:border-gray-500';
    const currentClasses = isActive ? activeClasses[color] : inactiveClasses;

    return (
        <aWeb.div 
            style={{ 
                transform: spring.scale.to(s => `scale(${s})`),
                width: 120, 
                height: 160 
            }}
            className="cursor-pointer"
            onMouseEnter={handlePointerOver}
            onMouseLeave={handlePointerOut}
            onClick={onClick}
        >
             <div className={`w-full h-full p-4 rounded-lg flex flex-col items-center justify-center transition-all duration-300 border-2 ${currentClasses}`}>
                <Icon className="h-12 w-12 mx-auto" />
                <span className="mt-2 text-lg font-semibold">{label}</span>
            </div>
        </aWeb.div>
    );
};

const NAV_ITEM_HEIGHT = 160; // height of NavItem in pixels
const NAV_ITEM_GAP = 16; // gap in pixels

const NavButtonList = ({ items, activeView, onSelectView }: {
    items: NavItemData[];
    activeView: ViewType;
    onSelectView: (view: ViewType) => void;
}) => {
    const activeIndex = items.findIndex(item => item.view === activeView);
    
    const indicatorSpring = useSpringWeb({
        transform: `translateY(${activeIndex * (NAV_ITEM_HEIGHT + NAV_ITEM_GAP)}px)`,
        config: { mass: 1, tension: 220, friction: 25 },
    });
    
    const indicatorColor = items[activeIndex]?.color === 'cyan' ? '#67e8f9' : '#c084fc';

    return (
        <div className="relative p-4 bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-700/50">
             {/* Sliding indicator */}
             <aWeb.div 
                style={indicatorSpring}
                className="absolute top-4 left-4 w-[120px] h-[160px] rounded-lg -z-10"
             >
                <div 
                    className="w-full h-full rounded-lg"
                    style={{
                        backgroundColor: indicatorColor,
                        opacity: 0.3,
                        boxShadow: `0 0 20px 5px ${indicatorColor}`,
                    }}
                />
             </aWeb.div>
             
            {/* Navigation Items */}
            <div className="flex flex-col items-center" style={{ gap: `${NAV_ITEM_GAP}px` }}>
                {items.map((item) => (
                    <NavItem 
                        key={item.view}
                        item={item}
                        isActive={activeView === item.view}
                        onClick={() => onSelectView(item.view)}
                    />
                ))}
            </div>
        </div>
    );
};


// --- Main Scene Component ---

const Scene: React.FC<SceneProps> = (props) => {
  const { activeView, selectedContact, selectedMeeting } = props;

  const animatedDetailProps = useSpring({
    position: ((selectedContact || selectedMeeting) ? [1.8, 1.6, 0.3] : [4, 1.6, 0]) as [number, number, number],
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
      
      {/* Nav Panel */}
      <group position={[-1.1, 1.6, 0.3]} rotation={[0, 0.4, 0]}>
         <mesh>
            <planeGeometry args={[0.5, PANEL_HEIGHT]} />
            <meshStandardMaterial transparent opacity={0} />
             <Html
              transform
              occlude
              className="w-[152px] h-[380px] html-content" /* Adjusted size for nav items + padding */
              position={[0, 0, 0.01]}
            >
                <NavButtonList 
                    items={navItems}
                    activeView={activeView}
                    onSelectView={props.setActiveView}
                />
            </Html>
         </mesh>
      </group>


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
      <a.group {...animatedDetailProps} rotation={[0, -0.5, 0]}>
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