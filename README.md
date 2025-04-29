# Expense Management App 💰

## Description 📄

This project is a simple yet powerful Expense Management app designed to help users keep track of their daily expenses. Built with Expo, it leverages the capabilities of React Native to provide a seamless and intuitive user experience. The app focuses on privacy and offline functionality by using local storage to save expense data directly on the user's device.

## About this project 📱

This is an Expense Management app built with Expo. The app allows users to track their expenses using local storage, without the need for a database.

### Additional Features 🚀

- **Update Profile**: Users can update their profile information, including name, email, and profile picture.
- **Manage Categories**: Users can add, edit, or delete expense categories to better organize their expenses.
- **Change PIN**: Users can set or change a PIN to secure access to the app.
- **Filters and Searching**: Users can filter and search transactions by amount, category, date, or description to quickly find specific expenses.
- **Export Transactions**: Users can export their transaction history as a CSV file for easy sharing and record-keeping.

## Environment Variables 🌐

This project uses environment variables to manage sensitive information. Create a `.env` file in the root directory and add the following:

```
EXPO_PUBLIC_SECURE_KEY=your_secure_key_here
```

Make sure to replace `your_secure_key_here` with your actual secure key.

## Features ✨

- Add new expenses with details such as amount, category, and date.
- View a list of all recorded expenses.
- Edit or delete existing expenses.
- Filter expenses by category or date.

## Local Storage 💾

This app uses the [AsyncStorage](https://react-native-async-storage.github.io/async-storage/docs/install/) library to store data locally on the device. This ensures that your expense data is available even when offline.

## Installation 🛠️

1. Clone the repository:

   ```bash
   git clone https://github.com/rohitp-18/expense-tracker-app.git
   cd expense-management-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the app:

   ```bash
   npx expo start
   ```

## Usage 📖

1. Open the app on your device or emulator.
2. Use the interface to add, view, edit, and delete expenses.
3. Filter expenses to view specific categories or date ranges.

## Contributing 🤝

If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## Privacy 🔒

This app does not use a database to store your expense data. All data is stored locally on your device using AsyncStorage, ensuring that your information remains private and is not shared with any external servers.
