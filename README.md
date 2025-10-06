# LoginApp – Next.js + Firebase Authentication

## Overview
This is a simple Next.js application that provides a login and registration system using Firebase Authentication.  

The app has:
- A login and registration page where users can enter their **full name, email, and password**  
- Firebase Authentication to handle user login and registration  
- A home page that greets the user by their full name and gives them the option to log out  

---

## Features
- Register a new account with name, email and password  
- Log in with an existing account  
- Redirect to a home page that displays a welcome message with the user’s name  
- Log out and return to the login page  
- Basic validation for email format, required name, and password length (Minimum 8 Character in that one special character, one uppercase)

---

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/loginapp.git
   cd loginapp

---

## Approach
I used Next.js (App Router) for the structure and Firebase Authentication for handling login and registration. The login page allows toggling between login and registration, validates inputs, and uses Firebase’s methods (createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile).

When a user logs in successfully, they are redirected to the home page where their name is displayed. From there they can log out, which clears the session and redirects them back to the login page.

---

## Challenges
- At first I ran into an invalid API key error. This was caused by environment variables not being picked up properly. I fixed it by double-checking the .env.local file and making sure the values matched the Firebase Web App config.
- I also saw a hydration error because of a browser extension (Grammarly). Testing in incognito mode solved that issue.
- Restarting the dev server after setting environment variables was important, otherwise Firebase couldn’t initialize correctly.

---

## Future Improvements

If I had more time, I would add:

- Password reset and email verification
- A better UI with Tailwind CSS or another component library
- Clearer error messages and loading states
- Add external authentication options such as **Google Sign-In** or **Apple/iCloud login**  
