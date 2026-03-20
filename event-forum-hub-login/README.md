# One-stop Event Forum + Community Hub

This project is a web application designed for students to check events, upload details, interact with each other, and receive reminders. The application features a login page where users can authenticate themselves to access the community hub.

## Project Structure

```
event-forum-hub-login
├── src
│   ├── components
│   │   └── LoginPage.tsx
│   ├── hooks
│   │   └── useAuth.ts
│   ├── services
│   │   └── authService.ts
│   ├── styles
│   │   └── LoginPage.module.css
│   ├── types
│   │   └── index.ts
│   └── App.tsx
├── public
│   └── index.html
├── package.json
├── tsconfig.json
└── README.md
```

## Features

- **User Authentication**: Secure login and logout functionality.
- **Event Management**: Users can view and upload event details.
- **Community Interaction**: A platform for students to interact and share information.
- **Reminders**: Users receive notifications for upcoming events.

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd event-forum-hub-login
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

## Technologies Used

- React
- TypeScript
- CSS Modules
- Custom Hooks
- RESTful API for authentication

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.