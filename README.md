# React Form App

## Project Description
This project is a simple responsive web application that displays JSON data in a table. Users can add new items through a form with validation, and the application supports a dark mode toggle with an icon on the top right. Additionally, an external API for location data is utilized to aid users in adding their address.

## Deployment
The application has been deployed on github pages. You can access the deployed version at the following URL:

[Live Application](https://mintdevil.github.io/form-react-app/)

## Steps to run in development mode
1. Clone the repository
   ```
   git clone https://github.com/mintdevil/form-react-app.git
   ```
2. Navigate to project directory
3. Install dependencies
   ```
   npm install
   ```
4. Create an API key on [geoapify](https://apidocs.geoapify.com/)
5. Rename the `env.txt` file to `.env` and replace `your_api_key` with the key you have obtained in the previous step
6. Run the application locally
   ```
   npm run dev
   ```

## Usage
1. View the JSON data in the table on the main page.
2. Click the "Add Item" button to open the form and enter new data.
3. Form fields have validation to ensure data integrity.
4. Click the "Get" button next to address field and allow location usage to automatically fill in your address, nationality, and phone code. 
5. Submitting the form adds the data to the table and resets the form.
6. Use the icon on the top right of the page to toggle between light and dark modes.

## Troubleshooting
1. Ensure that Node.js and npm are installed on your machine. You can download Node.js from their official website (https://nodejs.org/en/).
   
2. Make sure you have Node.js version `20.11.0` and npm version `10.2.4` installed. 

   To check your current versions:
```
node -v
npm -v
```

3. If you're still having trouble, try deleting the `node_modules` folder and running `npm install` again:
```
rm -rf node_modules
npm install
```

## Libraries used
[Vite](https://vitejs.dev/)
[React](https://react.dev/)
[Heroicons](https://heroicons.com/)
[TailwindCSS](https://tailwindcss.com/)
[Flowbite](https://flowbite.com/)
[TW Elements](https://tw-elements.com/)
