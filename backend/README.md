# Cafe Menu System

A comprehensive web application designed for cafes to manage and display their menus online. This system includes a secure admin panel for content management and a responsive frontend for customers to view menus, promotions, and cafe information.

## Features

### Customer-Facing Website
- **Menu Browsing:** View different menu types (main menu, drinks menu, etc.)
- **Category Navigation:** Browse items organized by categories
- **Product Details:** See product images, descriptions, and prices
- **Promotions:** View special offers and campaigns
- **About Section:** Information about the cafe, including contact details, address, and working hours

### Admin Dashboard
- **Secure Login:** Spring Security-based authentication system
- **Menu Management:** Create and manage different menu types
- **Category Management:** Organize products into categories
- **Product Management:** Add, edit, and delete products with images, descriptions, and prices
- **Image Handling:** Automatic image compression and format optimization
- **Cafe Information:** Update cafe details, working hours, and contact information
- **Promotions:** Create and manage promotional campaigns
- **Analytics:** Track daily, monthly, and yearly visitor statistics

## Technology Stack

### Backend
- **Java 17**
- **Spring Boot**
- **Spring MVC**
- **Spring Security**
- **Spring Data JPA**
- **MySQL Database**
- **Flyway** for database migrations
- **Bucket4j** for rate limiting

### Frontend
- **Thymeleaf** template engine
- **HTML5 / CSS3**
- **Bootstrap** for responsive design
- **JavaScript**

### Features
- **Mobile-Responsive Design**
- **Comprehensive Logging**
- **Exception Handling** with custom error pages
- **Input Validation**
- **Rate Limiting** to prevent abuse
- **Image Optimization** for performance

## Installation - Local Development

### Prerequisites
- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

### Steps
1. Clone the repository
   ```
   https://github.com/nikookinn/cafe-web-application.git
   ```

2. Configure MySQL database in `application.properties`
   ```
   spring.datasource.url=jdbc:mysql://localhost:3306/cafe_menu_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. Build the project
   ```
   mvn clean install
   ```

4. Run the application
   ```
   java -jar target/piramida-web-app-0.0.1-SNAPSHOT.jar
   ```
5. Create the initial admin user manually in MySQL:

   a. Connect to your MySQL database

   b. Create a user in the `users` table with a BCrypt encoded password:
      ```sql
      INSERT INTO users (username, password, enabled) 
      VALUES ('admin', '$2a$10$YourBCryptHashHere', 1);
      ```
   c. Add an authority record:
      ```sql
      INSERT INTO authorities (id, username, authority) 
      VALUES ('1','admin', 'ROLE_ADMIN');
      ```

6. Access the application
   - Frontend: `http://localhost:8080`
   - Admin Panel: `http://localhost:8080/admin/dashboard`
## Docker Deployment

### Prerequisites
- Docker and Docker Compose installed
- 
### Deployment Steps

1. Build and start the containers
   ```bash
   docker-compose up -d
   ```

2. Create the initial admin user

   After the containers are running, create the first admin user manually:

   a. Connect to MySQL container:
   ```bash
   docker exec -it mysql_db mysql -uroot -proot app_db
   ```

   b. Create a user in the `users` table with a BCrypt encoded password:
   ```sql
   INSERT INTO users (username, password, enabled) 
   VALUES ('admin', '$2a$10$YourBCryptHashHere', 1);
   ```

   c. Add an authority record:
   ```sql
   INSERT INTO authorities (id, username, authority) 
   VALUES ('1','admin', 'ROLE_ADMIN');
   ```

3. Access the application
   - Main website: http://localhost:8080
   - Admin dashboard: http://localhost:8080/admin/dashboard

## Usage

### Admin Panel
1. Navigate to `http://localhost:8080/admin/dashboard`
2. Login with your admin credentials
3. Use the sidebar to navigate between different management sections:
   - Menu Types: Create and manage different menu types (Main Menu, Drinks, etc.)
   - Categories: Create categories within each menu type
   - Products: Add products with images, descriptions, and prices
   - Promotions: Create special offers with images and descriptions
   - Cafe Information: Update cafe details, hours, address, and contact info
   - Analytics: View visitor statistics

### Customer View
1. Navigate to `http://localhost:8080`
2. Browse different menus
3. Click on categories to view products
4. View product details, prices, and descriptions
5. Check promotions and cafe information

## Future Enhancements
- Online ordering system
- Customer accounts and loyalty program
- Reservation system
- Multi-language support
- Dark mode theme

