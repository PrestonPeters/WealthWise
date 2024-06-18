## Introduction
This is the final project for my CMPT 370 (Intro to Software Engineering) class at the University of Saskatchewan that I worked on with 6 of my classmates.
All of the collaborators on the project are listed in the commits except for Prajakta Sanjay who performed most of the frontend design for the Spending
Tracker feature of the website. 

My personal contribution was primarily client/server interaction, quality control, troubleshooting, and also the Debt Repayment calculator feature. I spent
a lot of time assisting with the database queries and server operation for the Spending Tracker feature as well.

## Prerequisites
Before you begin, please ensure you have Docker desktop installed on your machine. If you don't have Docker yet, you can download it from Docker Desktop.
    https://www.docker.com/products/docker-desktop/


## Running Instructions

1) Clone the repository
    First, clone the Git repository to your local machine using the following command:
        git clone https://github.com/PrestonPeters/WealthWise.git

2) Navigate to the Project Directory
    Change to the project directory in your terminal:
        cd ./WealthWise

3) Start Docker
    Use Docker Compose to build and start the project:
        docker-compose up --build 

4) Access the Application
    Once Docker has finished setting up, you can access the application by navigating to:
        http://localhost:3000

5) When you're done, you can shut down the Docker environment. To do this, use the following command:
    CTRL C
    docker-compose down -v
