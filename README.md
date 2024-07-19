Here's the README.md file for the Chatox project:

```markdown
# Chatox - Real-time Chat Application

![Chatox](https://github.com/rachit-bharadwaj/chatox/raw/main/assets/logo.png)

Chatox is a real-time chat application that allows users to communicate instantly with their friends and colleagues. It offers seamless registration and login, real-time chatting, user profile customization, and a user-friendly interface. Chatox is a web-app available online and free to use.

![Demo](https://github.com/rachit-bharadwaj/chatox/raw/main/assets/demo.png)

## Features

- **Registration and Login**: Users can register and login to the app easily.
- **Search Users**: Search for people by name, email, or username.
- **Real-time Chat**: Start new conversations or continue previous chats in real-time.
- **Profile Customization**: Edit your profile to include a bio and a profile picture.

### User Registration and Login
![User Registration and Login](https://github.com/rachit-bharadwaj/chatox/raw/main/assets/register_login.png)

### Main Chat Interface
![Main Chat Interface](https://github.com/rachit-bharadwaj/chatox/raw/main/assets/main_chat.png)

## Technologies Used

### Server
```json
{
  "name": "server",
  "version": "1.0.0",
  "main": "index.ts",
  "scripts": {
    "dev": "nodemon",
    "start": "node build/index.js",
    "build": "npm i && tsc && npm --prefix ../client install && npm --prefix ../client run build"
  },
  "dependencies": {
    "bcrypt": "^5.1.1",
    "body-parser": "^1.20.2",
    "cloudinary": "^2.3.0",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.5.1",
    "multer": "^1.4.5-lts.1",
    "socket.io": "^4.7.5",
    "typescript": "^5.5.3"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/cookie-parser": "^1.4.7",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/mongoose": "^5.11.97",
    "@types/multer": "^1.4.11",
    "nodemon": "^3.1.4",
    "ts-node": "^10.9.2"
  }
}
```

### Client
```json
{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@radix-ui/react-alert-dialog": "^1.1.1",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "axios": "^1.7.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "emoji-picker-react": "^4.11.1",
    "js-cookie": "^3.0.5",
    "jsonwebtoken": "^9.0.2",
    "lucide-react": "^0.408.0",
    "moment": "^2.30.1",
    "next-themes": "^0.3.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-icons": "^5.2.1",
    "react-resizable-panels": "^2.0.20",
    "react-router-dom": "^6.24.1",
    "server": "file:../server",
    "socket.io-client": "^4.7.5",
    "sonner": "^1.5.0",
    "tailwind-merge": "^2.4.0",
    "tailwind-scrollbar": "^3.1.0",
    "tailwindcss-animate": "^1.0.7",
    "zustand": "^4.5.4"
  },
  "devDependencies": {
    "@types/js-cookie": "^3.0.6",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/node": "^20.14.10",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^7.13.1",
    "@typescript-eslint/parser": "^7.13.1",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.7",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.2.2",
    "vite": "^5.3.1"
  }
}
```

## Installation and Setup

1. **Clone the repository**
    ```sh
    git clone https://github.com/rachit-bharadwaj/chatox.git
    ```

2. **Install dependencies**
    - Navigate to the server directory and install dependencies
        ```sh
        cd server
        npm install
        ```
    - Navigate to the client directory and install dependencies
        ```sh
        cd ../client
        npm install
        ```

3. **Update backend URL**
    - Update the backend URL in the constants file located in the client directory.

4. **Run the project**
    - Navigate to the server directory and start the server
        ```sh
        cd ../server
        npm run dev
        ```
    - Navigate to the client directory and start the client
        ```sh
        cd ../client
        npm run dev
        ```

## Licensing

Chatox is open for contributions but cannot be used for commercial purposes. The project is licensed under the [Non-Commercial Use License](https://choosealicense.com/licenses/ncsa/).

## Contact

For any queries or more such projects, visit my [portfolio](https://rachit.infornics.com/).
```

Feel free to add or modify any sections as needed. The provided details should give a comprehensive overview of the Chatox project. If you need any more information or adjustments, let me know!