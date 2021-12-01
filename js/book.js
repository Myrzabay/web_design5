// Book Class: Represents a Book
class Movie {
  constructor(index, name, country, genre, date) {
    this.index = index;
    this.name = name;
    this.country = country;
    this.genre = genre;
    this.date = date;
    
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displayMovies() {
    const movies = Store.getMovies();

    movies.forEach((movie) => UI.addMoviesToList(movie));
  }

  static addMoviesToList(movie) {
    const list = document.querySelector('#movie-list');

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${movie.index}</td>
      <td>${movie.name}</td>
      <td>${movie.country}</td>
      <td>${movie.genre}</td>
      <td>${movie.date}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }

  static deleteMovie(el) {
    if(el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#movie-form');
    container.insertBefore(div, form);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#index').value = '';
    document.querySelector('#name').value = '';
    document.querySelector('#country').value = '';
    document.querySelector('#genre').value = '';
    document.querySelector('#date').value = '';
  }
}

// Store Class: Handles Storage
class Store {
  static getMovie() {
    let movies;
    if(localStorage.getItem('movies') === null) {
      movies = [];
    } else {
      movies = JSON.parse(localStorage.getItem('movies'));
    }

    return movies;
  }

  static addMovie(movie) {
    const movies = Store.getMovie();
    movies.push(movie);
    localStorage.setItem('movies', JSON.stringify(movies));
  }

  static removeMovie(isbn) {
    const movies = Store.getMovie();

    movies.forEach((movie, index) => {
      if(movie.isbn === isbn) {
        movies.splice(index, 1);
      }
    });

    localStorage.setItem('movies', JSON.stringify(movies));
  }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayMovie);

// Event: Add a Book
document.querySelector('#movie-form').addEventListener('submit', (e) => {
  // Prevent actual submit
  e.preventDefault();

  // Get form values
  const index = document.querySelector('#index').value;
  const name = document.querySelector('#name').value;
  const country = document.querySelector('#country').value;
  const genre = document.querySelector('#genre').value;
  const date = document.querySelector('#date').value;


  // Validate
  if(index === '' || name === '' || country === '' || genre === '' || date === '') {
    UI.showAlert('Please fill in all fields', 'danger');
  } else {
    // Instatiate book
    const movie = new Movie(index, name, country, genre, date);

    // Add Book to UI
    UI.addMoviesToList(movie);

    // Add book to store
    Store.addMovie(movie);

    // Show success message
    UI.showAlert('Movie Added', 'success');

    // Clear fields
    UI.clearFields();
  }
});

// Event: Remove a Book
document.querySelector('#movie-list').addEventListener('click', (e) => {
  // Remove book from UI
  UI.deleteMovie(e.target);

  // Remove book from store
  Store.removeMovie(e.target.parentElement.previousElementSibling.textContent);

  // Show success message
  UI.showAlert('Movie Removed', 'success');
});