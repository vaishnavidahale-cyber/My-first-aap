# Event Forum Hub - Campus Event Management App

A comprehensive React Native application built with Expo for managing campus events, fostering community interaction, and streamlining event organization.

## 🚀 Features

### 📅 Event Management
- **Event Discovery**: Browse upcoming events with search and filter capabilities
- **Event Details**: Comprehensive event information including date, time, venue, description, and rules
- **Event Registration**: One-click registration with QR code generation
- **Event Creation**: Admins and hosts can create events with rich details
- **Event Categories**: Technology, Cultural, Sports, Academic, Workshop
- **Event Status Tracking**: Upcoming, ongoing, completed events

### 👥 User Management & Authentication
- **Role-based Access**: Student, Host, Admin roles with different permissions
- **User Profiles**: Personalized profiles with registration history
- **Secure Authentication**: Login/logout with persistent sessions
- **College Integration**: College-specific user management

### 🏛️ Clubs & Communities
- **Club Management**: Separate sections for different clubs and societies
- **Club Membership**: Join clubs and access exclusive events
- **Club Events**: Club-specific event organization and management
- **Community Hub**: Discover and interact with various campus communities

### 💬 Communication & Interaction
- **Event-specific Chat**: Discussion threads for each event
- **Community Chat**: General discussion rooms
- **Club Chat**: Private communication channels for club members
- **Real-time Messaging**: Instant communication features
- **Polls & Q&A**: Interactive features for events

### 🔔 Notifications & Reminders
- **Event Reminders**: Automated notifications for upcoming events
- **Registration Confirmations**: Instant confirmation messages
- **Announcements**: Important updates and news
- **Push Notifications**: Real-time notification system

### 🛠️ Admin Panel
- **Event Management**: Create, edit, delete events
- **User Management**: Manage user accounts and permissions
- **Analytics Dashboard**: Event statistics and user engagement metrics
- **System Settings**: Configure app-wide settings
- **Revenue Tracking**: Monitor event revenue and registrations

## 🏗️ Technical Architecture

### Frontend
- **React Native** with Expo
- **TypeScript** for type safety
- **Expo Router** for navigation
- **Context API** for state management
- **AsyncStorage** for local data persistence

### Key Components
- **AuthContext**: User authentication and session management
- **EventContext**: Event data and operations management
- **EventCard**: Reusable event display component
- **Tab Navigation**: Bottom tab navigation with 4 main sections

### Screens Structure
```
app/
├── (tabs)/
│   ├── index.tsx          # Home/Events screen
│   ├── explore.tsx        # Community/Clubs screen
│   ├── notifications.tsx  # Notifications screen
│   └── chat.tsx          # Chat/Communication screen
├── event/
│   └── [id].tsx          # Event details screen
├── login.tsx             # Authentication screen
├── profile.tsx           # User profile screen
├── create-event.tsx      # Event creation screen
└── admin.tsx            # Admin panel screen
```

## 📱 User Interface

### Design System
- **Modern UI**: Clean, intuitive interface with consistent design patterns
- **Color Scheme**: Professional blue (#3498db) with accent colors
- **Typography**: Clear hierarchy with readable fonts
- **Icons**: Ionicons for consistent iconography
- **Responsive**: Optimized for various screen sizes

### Key UI Features
- **Search & Filter**: Advanced filtering by category, date, and keywords
- **Card-based Layout**: Clean event cards with essential information
- **Tab Navigation**: Easy access to main app sections
- **Floating Action Buttons**: Quick access to primary actions
- **Pull-to-refresh**: Intuitive data refreshing
- **Loading States**: Smooth loading experiences

## 🔐 Security & Permissions

### Role-based Access Control
- **Students**: Can view and register for events, join clubs, participate in chats
- **Hosts**: Can create and manage their own events
- **Admins**: Full access to all features including user management

### Data Security
- **Local Storage**: Secure local data persistence
- **Session Management**: Automatic session handling
- **Input Validation**: Comprehensive form validation

## 📊 Data Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  college: string;
  role: 'student' | 'host' | 'admin';
  profileImage?: string;
}
```

### Event Model
```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  hostId: string;
  hostName: string;
  clubId?: string;
  clubName?: string;
  price: number;
  maxParticipants?: number;
  currentParticipants: number;
  registeredUsers: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
  rules?: string;
  contactInfo: string;
  registrationLink?: string;
}
```

### Club Model
```typescript
interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  memberIds: string[];
  adminIds: string[];
  createdAt: string;
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for testing)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npx expo start
   ```
4. Use Expo Go app on your device or run on simulator

### Dependencies
- `expo`: ~52.0.11
- `react-native`: 0.76.3
- `@expo/vector-icons`: ^14.0.4
- `expo-router`: ~4.0.9
- `@react-native-async-storage/async-storage`: ^2.1.0
- `@react-native-community/datetimepicker`: ^8.2.0
- `react-native-qrcode-svg`: ^6.3.11
- `react-native-svg`: ^15.8.1

## 📱 App Flow

### Authentication Flow
1. **Login Screen**: Users enter credentials
2. **Role Detection**: System identifies user role
3. **Main App**: Navigate to appropriate dashboard

### Event Flow
1. **Discovery**: Browse events on home screen
2. **Details**: View comprehensive event information
3. **Registration**: Register with one click
4. **Confirmation**: Receive QR code and confirmation
5. **Reminders**: Get notified before event

### Community Flow
1. **Explore**: Discover clubs and communities
2. **Join**: Become member of relevant clubs
3. **Participate**: Engage in club events and discussions
4. **Chat**: Communicate with community members

## 🎯 Future Enhancements

### Planned Features
- **Event Reviews**: Post-event feedback and ratings
- **Photo Sharing**: Upload and share event photos
- **Calendar Integration**: Sync with device calendars
- **Payment Integration**: Handle paid events
- **Live Streaming**: Stream events in real-time
- **Geolocation**: Location-based event discovery
- **Social Features**: Friend connections and social sharing

### Technical Improvements
- **Offline Support**: Cache data for offline access
- **Push Notifications**: Real-time notification system
- **Performance Optimization**: Lazy loading and caching
- **Testing**: Comprehensive unit and integration tests
- **CI/CD**: Automated deployment pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Event Forum Hub** - Connecting campus communities through seamless event management and engagement.