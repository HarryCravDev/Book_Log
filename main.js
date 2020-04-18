// Book Constructor
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Constructor
class UI {
    addBookToList(book){
        // Get table container
        const list = document.getElementById('book-list');

        // Creat row
        const row = document.createElement('tr');

        // Create values
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete secondary-content">X</a></td>
        `;

        // Append book to row
        list.appendChild(row);
    }

    showAlert(message, className){
        // Create DIV
        const div = document.createElement('div');
        // Add Class
        div.classList = `alert ${className}`;
        // Add Text
        div.appendChild(document.createTextNode(message));
        // Get Form
        const form = document.getElementById('book-form');
        // Get Container
        const container = document.querySelector('.container');
        // Insert
        container.insertBefore(div, form);

        // Delete Alert
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deleteBook(target){
        if(target.classList.contains('delete')){
            target.parentElement.parentElement.remove();
            
        }
    }

    clearFields(){
        document.getElementById('book').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

// Store to local storage
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books')); 
        }

        return books
    }

    static displayBooks(){
        const books = Store.getBooks();

        books.forEach((book) => {
            const ui = new UI;

            ui.addBookToList(book);
        });
    }

    static addBook(book){
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        
        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Add books to UI on DOM load - Event Listener
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Add Book - Event Listener
document.getElementById('book-form').addEventListener('submit', (e) => {
    // Get Form Value
    const title = document.getElementById('book').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

    // Init Book
    const book = new Book(title, author, isbn);
    
    // Init UI
    const ui = new UI;

    // Validate
    if(title === '' || author === '' || isbn === ''){
        ui.showAlert('Please fill in all fields', 'red');
    } else {
        // Add Book to List
        ui.addBookToList(book);

        // Add to LS
        Store.addBook(book);

        // Show Successful log
        ui.showAlert('Book added!', 'green');
    
        // Clear input fields
        ui.clearFields();
    }

    
    e.preventDefault();
});

// Add Book - Event Listener
document.getElementById('book-list').addEventListener('click', (e) => {
    // Init UI
    const ui = new UI;

    if(e.target.classList.contains('delete')){
        // Delete book
        ui.deleteBook(e.target);
        // Delete from LS
        Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
        // Show Alert
        ui.showAlert('Book Removed!', 'green');
    }
    // Delete book
    ui.deleteBook(e.target);

    e.preventDefault();
});
