const express = require('express'); //importing express
const app = express();
app.use(express.json()); // for parsing application/json

class Book {//Book credentials
    constructor(title, author, ISBN) {
        this.title = title;
        this.author = author;
        this.ISBN = ISBN;
    }//books info


    displayInfo() {
        return `${this.title} writen by ${this.author}, ISBN: ${this.ISBN}`; //books format to response 
    }
}

class EBook extends Book {//eBook credentials with addition of Book credentials
    constructor(title, author, ISBN, fileFormat) {
        super(title, author, ISBN);
        this.fileFormat = fileFormat;
    }

    displayInfo() {
        return `${super.displayInfo()}, Format: ${this.fileFormat}`; //books another format
    }
}

class Library {
    constructor() {
        this.books = [];//books array
    }

    addBook(book) {
        this.books.push(book); //adding book to the books array
    }

    displayBooks() {
        return this.books.map(book => book.displayInfo());//to display the books 
    }

}

const library = new Library();//initiating the library function here

// API Endpoints
app.post('/addBooks', (req, res) => {  //posting data into the json file in header Content-Type:application/json and json dat in [{"title": "Love", "author": "Rakesh", "ISBN": 123},{"title": "Love", "author": "Rakesh", "ISBN": 124}]
    const books = req.body;

    if (Array.isArray(books) && books.length > 0) {
        books.forEach(bookData => { //for multiple books are added then it will be store on by one with for each method to access every book
            const { title, author, ISBN, fileFormat } = bookData;

            if (fileFormat) {
                const eBook = new EBook(title, author, ISBN, fileFormat);//title is string, author is string, ISBN is unique number ,fileformat is string
                library.addBook(eBook);//add the book to the books array
                console.log(eBook)
            } else {
                const book = new Book(title, author, ISBN);//title is string, author is string, ISBN is unique number 
                library.addBook(book);//add the book to the books array
                console.log(book)
            }
        });

        res.status(201).send('Books added successfully');
    } else {
        res.status(400).send('Invalid data format');
    }
});

//by making get request we get the data 

app.get('/listBooks', (req, res) => {
    res.json(library.displayBooks());
});


// by using delete method we will delete the book data based on ISBN 

app.delete('/deleteBook', (req, res) => {
    const { ISBN } = req.body;
    const index = library.books.findIndex(book => book.ISBN === ISBN);//if the booke not present in the array then the index will be -1
    console.log(library.books.map((i)=>{return i.ISBN}))//accessing the ISBN ID
    if (index !== -1) {//checking the book ISBN
        library.books.splice(index, 1);//remove the book from books array
        res.send('Book deleted successfully');
    } else {
        res.status(404).send('Book not found');//if the book is not in array then it wiil shoe the resopnse Book not found
    }
});

// Start server in 5000 port 
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


