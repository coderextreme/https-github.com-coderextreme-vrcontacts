Project Brief: 3D AI-Powered Productivity Hub
1. High-Level Concept
We want to build a futuristic, proof-of-concept productivity application for managing contacts and meetings. The core idea is to move beyond traditional flat interfaces and create an immersive, 3D "command center" or "cockpit-style" environment. The user should feel like they are interacting with a high-tech holographic display.
The application will have two primary functions: a Contact Manager and a Meeting Scheduler, with an integrated AI feature to provide intelligent briefings for upcoming meetings.
2. Core Features & Functionality
2.1. Main Views & Navigation
The application will have two distinct views: "Contacts" and "Meetings".
The user must be able to seamlessly switch between these two views using a clear, dedicated navigation panel.
2.2. Three-Panel Layout
The UI should be consistently structured across both views in a three-panel layout:
Left Panel (Navigation): Contains the controls to switch between the "Contacts" and "Meetings" views.
Center Panel (List View): Displays a scrollable list of either contacts or meetings, depending on the active view.
Right Panel (Detail View): Displays the detailed information for the item selected from the center panel. This panel should be hidden or off-screen until an item is selected, at which point it should animate into view.
2.3. Contact Management
List View: Display all contacts, showing their avatar, name, and job title.
Detail View: When a contact is selected, show their full details: a larger avatar, name, title, company, email, and phone number.
Full CRUD:
Create: A button to add a new contact, which opens a modal with a form for all contact fields.
Update: An "Edit" button on the detail view to open the same modal, pre-filled with the contact's information.
Delete: A "Delete" button on the detail view, which prompts the user for confirmation before removing the contact. Deleting a contact should also remove them from any meetings they were attending.
2.4. Meeting Management
List View: Display all meetings, showing their title and scheduled time.
Detail View: When a meeting is selected, show its full details: title, date/time, duration, recurrence status, agenda, and a list of attendees (with their avatars and names).
Full CRUD:
Create: A button to add a new meeting, opening a modal form.
Update: An "Edit" button on the detail view to modify the meeting.
Delete: A "Delete" button with a confirmation prompt.
Attendee Management:
The meeting form must allow the user to select attendees from the existing list of contacts.
The meeting detail view should have a "Manage Attendees" button that opens a dedicated modal. This modal should display all contacts and allow the user to check/uncheck who should attend the meeting.
2.5. AI-Powered Meeting Briefings
Integration: This is the key "intelligent" feature. On the meeting detail panel, there must be a button to "Generate AI Briefing".
Gemini API: This button will call the Google Gemini API.
Input: The prompt sent to the API should include the meeting's title, agenda, and the list of attendees (with their names, titles, and companies).
Output: The API must be instructed to return a structured JSON object containing:
summary: A concise, one-paragraph summary of the meeting's purpose.
attendeeBriefings: An array of objects, each containing an attendee's name and a short brief about their likely role and perspective in the meeting.
talkingPoints: An array of 3-5 key questions or talking points to help drive the conversation.
Display: The generated briefing should be displayed cleanly within the detail panel. The UI must handle a loading state while the API call is in progress and show an error message if it fails.
3. Technical & Design Specifications
Tech Stack:
Framework: React with TypeScript.
3D Rendering: react-three-fiber and @react-three/drei.
Styling: Tailwind CSS for all UI components.
Animation: react-spring for UI animations (panel transitions, hover effects).
3D Scene & Layout:
The environment should be a dark, abstract space (e.g., a grid floor, stars in the background) to emphasize the UI.
The three UI panels should be implemented as planes in the 3D space, arranged in a gentle arc around the camera to create the "cockpit" feel. They should be positioned and rotated to give a sense of depth and prevent visual overlap from the default camera angle.
HTML-in-3D Architecture:
All UI components (lists, forms, details) should be built as standard HTML/DOM elements. Use the @react-three/drei <Html> component to project these onto the planes in the 3D scene. This allows for the use of standard web technologies like CSS for layout and styling.
Aesthetics & UX:
Theme: Dark, futuristic, "glowing interface" aesthetic.
Color Palette: Use a base of dark grays and blacks. Assign a primary accent color to each view: purple for Contacts and cyan for Meetings. These colors should be used for highlights, borders, shadows, and icons to reinforce the context.
Interactivity: All interactive elements (buttons, list items) should have clear hover and active/selected states, enhanced with subtle animations (e.g., scaling, glowing shadows).
Modals: All forms for creating or editing data must be presented in modals that overlay the entire screen.
4. Initial State
The application should be pre-populated with a small, well-defined set of sample contacts and meetings to ensure the UI is immediately functional and demonstrative.
