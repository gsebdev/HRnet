# HRnet
## Description
This project was carried out as part of an Openclassrooms training course.
The task was to migrate an HR application used to register employees from JQuery to React.
In this project, I created several React components to replace the JQuery library:
- a data table
- a Datepicker
- a Modal
- a Custom Select

[See demo here](https://gsebdev.github.io/HRnet/)

<img height="400px" src="https://repository-images.githubusercontent.com/618823414/c53cde34-e417-4e23-b734-b22939f2d1c1" alt="HRnet cover image" />

## Features

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

* Use React Context to handle employees list and save it to localStorage but later can be connected to an API
* 4 Default employees records if no records are found in localStorage (this is useful for development but can be removed later)
* Custom actions can be added to the data table list (like "delete", etc...)
* Pagination, Search, Select, Sort functions are available in the data table list of employees
* The Select input options can be customized in the files : ./src/config/
## Usage
You can access the old jquery app in the folder: _old-jquery-app_
### Clone the projet
```
git clone https://github.com/gsebdev/HRnet.git
```
### Install dependencies
```
npm install
```
### Run development server
```
npm start
```
### Create a build 
```
npm run build
```


