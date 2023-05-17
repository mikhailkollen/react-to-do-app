# To-Do App README

This is a To-Do App built with React, React Router, Redux, TypeScript, and it uses a RESTful API for managing and storing tasks. The app allows users to create, view, update, and delete tasks. It also provides features like filtering tasks by tags and searching tasks.

## Features

- Create a new task
- View tasks in different lists
- Update task details
- Delete tasks
- Filter tasks by tags
- Search tasks by name
- Today's tasks modal
- Weather widget

## Technologies Used

- React
- React Router
- Redux
- TypeScript
- [RESTful API](<https://github.com/mikhailkollen/data-api>)

## Getting Started

To run the To-Do App locally, follow these steps:

1.  Clone the repository: `git clone https://github.com/mikhailkollen/react-to-do-app.git`
2.  Install the dependencies: `npm install`
3.  Start the development server: `npm run dev`
4.  Open your browser and visit `http://localhost:5173/` to access the app.
5.  Make sure to use a local storage for tasks or a custom-made API to fetch tasks.

Make sure you have Node.js and npm (Node Package Manager) installed on your machine.

## Project Structure

The project structure is organized as follows:

- `src/`: Contains the source code files
  - `components/`: Contains reusable components used in the app
    - `AllLists/`: Displays all the task lists
    - `Button/`: Button component used for actions
    - `Modal/`: Modal component for displaying task details
    - `List/`: Component to display a separate list
    - `TodayTasksModal/`: Modal component for displaying today's tasks
    - `WeatherWidget/`: Widget component for displaying weather information
  - `features/`: Contains Redux features and logic
    - `tasks/`: Tasks feature module
      - `tasksSlice.ts`: Redux slice for managing tasks state
      - `tasksThunk.ts`: Async actions for fetching and updating tasks
  - `utils/`: Utility functions and constants used in the app
  - `app/`: Custom app hooks and configuration
    - `hooks.ts`: Custom hooks for accessing Redux store and dispatch
  - `styles/`: CSS stylesheets
    - `css-reset.css`: CSS reset styles
    - `index.css`: Main CSS styles for the app
  - `App.tsx`: The main entry point of the app

## Usage

- The app displays a header with a title, a weather widget, a search input, and a button to add a new task.
- Tasks are organized into lists and displayed in the `AllLists` component.
- Users can filter tasks by tags by clicking on the corresponding tag buttons.
- Users can search for tasks by typing in the search input. The app will update the displayed tasks accordingly.
- Clicking on a task will open a modal displaying the task details.
- The app also includes a today's tasks modal that opens automatically on page load, showing tasks due today.
- To add a new task, click on the "+ New Task" button. This will open a modal where you can enter the task details.
- To update or delete a task, click on the task in the task list or in the modal and make the desired changes.
- The app automatically updates the tasks when changes are made in other tabs locally (using the `window.storage` event).
- The app uses React Router for handling routing based on the current tag and search query parameters.
