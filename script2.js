let bookIder = 1;

class LibraryAccount {
  constructor(name) {
    this.name = name;
    this.checkedBooks = [];
  }

  addBook(title, author) {
    this.checkedBooks.push(new Book(title, author));
  }
}

class Book {
  constructor(title, author) {
    this.title = title;
    this.author = author;
    this._id = bookIder++;
  }
}

class LibraryService {
  static url =
    "https://638959874eccb986e8905258.mockapi.io/CrudAPI/LibraryAccount"; //insert MockAPI url link here

  static getAllAccounts() {
    return $.get(this.url);
  }

  static getAccount() {
    return $.get(this.url + `/${id}`);
  }

  static createAccount(account) {
    console.log("HI" + account);
    return $.post(this.url, account);
  }

  static updateAccount(account) {
    return $.ajax({
      url: this.url + `/${account._id}`,
      dataType: "json",
      data: JSON.stringify(account),
      contentType: "application/json",
      type: "PUT",
    });
  }

  static deleteAccount(id) {
    return $.ajax({
      url: this.url + `/${id}`,
      type: "DELETE",
    });
  }
}

class DOMManager {
  static accounts;

  static getAllAccounts() {
    LibraryService.getAllAccounts().then((accounts) => this.render(accounts));
  }

  static createAccount(account) {
    LibraryService.createAccount(new LibraryAccount(account))
      .then(() => {
        return LibraryService.getAllAccounts();
      })
      .then((accounts) => this.render(accounts));
  }

  static deleteAccount(id) {
    LibraryService.deleteAccount(id)
      .then(() => {
        return LibraryService.getAllAccounts();
      })
      .then((accounts) => this.render(accounts));
  }

  static addBook(id) {
    
    for (let account of this.accounts) {
      if (account._id == id) {
        //console.log(account);
        account.checkedBooks.push(new Book(
          $(`#${account._id}-book-title`).val(),
          $(`#${account._id}-book-author`).val()
        )
        );
       // console.log(account.checkedBooks + "test");
        LibraryService.updateAccount(account)
          .then(() => {
            return LibraryService.getAllAccounts();
          })
          .then((accounts) => this.render(accounts));
      }
    }
  }

  static deleteBook(accountId, bookId) {
    for (let account of this.accounts) {
      if (account._id == accountId) {
        for (let book of account.checkedBooks) {
          if (book._id == bookId) {
            account.checkedBooks.splice(
              account.checkedBooks.indexOf(account),1);
            LibraryService.updateAccount(account)
              .then(() => {
                return LibraryService.getAllAccounts();
              })
              .then((accounts) => this.render(accounts));
          }
        }
      }
    }
  }

  static render(accounts) {
    this.accounts = accounts;
    $("#app").empty();
    for (let account of accounts) {
      $("#app").prepend(
        `<div id="${account._id}" class="card">
            <div class="card-header">
                <h2>${account.name}</h2>
                <button class="btn btn-danger" 
                onclick="DOMManager.deleteAccount('${account._id}')">Delete</button>
            </div>
            <div class="card-body">
                <div class="card">
                    <div class="row">
                        <div class="col-sm">
                            <input type="text" id="${account._id}-book-title"
                            class="form-control" placeholder="Book Title">
                        </div>
                        <div class="col-sm">
                            <input type="text" id="${account._id}-book-author"
                            class="form-control" placeholder="Book Author">
                        </div>
                    </div>
                    <button id="${account._id}-add-book" onclick="DOMManager.addBook('${account._id}')" class="btn btn-info form-control">Add Book</button>
                </div>
            </div><br>`
      );
      for (let book of account.checkedBooks) {
        $(`#${account._id}`)
          .find(".card-body")
          .append(
            `<p>
                <span id="title-${book._id}"><strong>Title: </strong> ${book.title}</span>
                <span id="author-${book._id}"><strong>Author: </strong> ${book.author}</span>
                <button class="btn btn-warning" onclick="DOMManager.deleteBook
                ('${account._id}','${book._id}')">Remove Book</button>
            </p>
            `
          );
      }
    }
  }
}

$("#create-new-account").on("click", () => {
  DOMManager.createAccount($("#new-account-name").val());
  $("#new-account-name").val("");
});

DOMManager.getAllAccounts();
