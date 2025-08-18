# Your Personal Bookshelf 
Use it : https://book-shelf-silk.vercel.app

## A Digital Reading Journal

### 📖 Project Overview

This project is a personal bookshelf web application designed to act as a digital reading journal. I created it to track my reading journey, keep a private collection of my books, and store all my thoughts and notes in one centralized place. It's built to provide a raw, aesthetic, and book-like feel, allowing me to manage my personal library with a clean and focused interface.

The application allows me to:

  * **Create a personalized collection** of books I am reading, have completed, or want to read.
  * **Track my reading progress** with a page counter and a visual progress bar.
  * **Store private notes** for each book, accessible in a dedicated notes section.

### ✨ Key Features

  * **User Authentication:** A secure login and registration system built with JWT (JSON Web Tokens) ensures that each user's bookshelf is private and secure.
  * **Dynamic Search:** Search for books in real-time using the Google Books API. The search bar provides instant suggestions and a dedicated `Home` page for a clean user experience.
  * **Bookshelf Management:** Easily add books to your collection from the search results. Books are organized into three distinct sections:
      * **Reading:** Books currently in progress.
      * **Completed:** Books you've finished reading.
      * **Want to Read:** Books on your reading list.
  * **Interactive Progress Tracking:** A slider and buttons (`+1`, `+10`, `-1`, `-10`) allow for intuitive page tracking. A book's status is automatically updated based on the number of pages read:
      * `0 pages` -\> `Want to Read`
      * `>0 and < total pages` -\> `Reading`
      * `>= total pages` -\> `Completed`
  * **Centralized Notes:** The application includes a dedicated notes page that aggregates all your notes in one place, making them easy to review and reference.
  * **Minimalist UI:** The design follows a clean, centered, and minimal aesthetic, inspired by old books and manuscripts.

### ⚙️ Technologies Used

This project is a full-stack MERN (MongoDB, Express.js, React, Node.js) application.

#### Frontend

  * **React:** For building the user interface with a modular component-based architecture.
  * **Vite & Bun:** For a fast and efficient development environment and build process.
  * **Axios:** A promise-based HTTP client for making API requests.

#### Backend

  * **Node.js & Express:** For the server-side logic and API.
  * **MongoDB & Mongoose:** For the NoSQL database and an Object Data Modeling (ODM) layer for easy data interaction.
  * **bcrypt.js:** For securely hashing and storing user passwords.
  * **jsonwebtoken:** For creating and verifying secure user authentication tokens (JWT).

### 🚀 How to Use the Deployed Application

1.  **Visit the Site:** Go to [your deployed frontend URL here] to access the live application.
2.  **Register:** Create a new account with a unique email and password.
3.  **Login:** Use your new credentials to log in.
4.  **Add Books:** Navigate to the `Home` page, use the search bar to find a book, and click "Add to Bookshelf."
5.  **Manage Books:** Go to the `Reading` or `Want to Read` sections in the header to view and update your books.

### 🔧 Local Development

If you want to run this project locally, follow these steps:

1.  **Clone the Repository:**
    ```
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```
2.  **Backend Setup:**
    ```
    cd backend
    pnpm install
    # Create a .env file with your MongoDB URI and API keys
    touch .env
    # Add your variables (MONGO_URI, JWT_SECRET, GOOGLE_BOOKS_API_KEY)
    pnpm start
    ```
3.  **Frontend Setup:**
    ```
    cd ../frontend
    bun install
    # Update the baseURL in frontend/src/api.js to point to your local backend
    bun run dev
    ```
4.  **Database:** Ensure a local MongoDB instance is running. You can use MongoDB Compass or the MongoDB Shell to verify that the `users` and `books` collections are created.

### 🎨 UI Design Philosophy

The design of this application is centered on a minimalist aesthetic. The goal was to create a digital space that feels like a calm and elegant physical library. The choice of the 'EB Garamond' font, a clean layout with generous spacing, and the use of subtle background textures and shadows are all intentional to provide a raw, book-like, and distraction-free experience.

-----
