# Bamazon
## Node.js & MySQL CLI Sales & Inventory App

#### What is Bamazon?
Bamazon is an Amazon-like CLI storefront that uses Node.js and MySQL. The app takes in fictional orders from customers and depletes stock from the store's inventory. The application includes an Admin Menu that allows a 'store manager' to add or updated inventory, and view low-inventory items. It can also track product sales across a store's departments and provide a summary of the highest-grossing departments in the store.


#### Customer View 
On the admin menu a customer choose to 'View Products for Sale', view those products, choose from a list of products and specify the quantity they want to purchase. This will return a total dollar amount for the order, and will then update the MySQL database with the updated inventory of that item. The application checks if the store has enough of the requested product to meet the customer's request, if not the customer is notified and the order isn't completed.

#### Manager View 
On the admin menu a manager can choose to 'View Low Inventory Items', 'Add to Inventory', or 'Add a New Product'. If the manager selects View Low Inventory, a list of all items with an inventory count lower than five is displayed. If the manager selects Add to Inventory, the app will display a prompt that will let the manager update the inventory total of any item currently in the store. Finally, If the  manager selects Add New Product, the manager can add a completely new product to the store.