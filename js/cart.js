//////////////////////////////////////////////////////////////////////
////////// Somethings I'd Like to Research

// JavaScript Static Methods
// JavaScript JSON object
// JavaScript localStorage object

//////////////////////////////////////////////////////////////////////
////////// Variables

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

//////////////////////////////////////////////////////////////////////
////////// Holds All Cart & Button Information

let cart = [];

let buttonsDOM = [];

//////////////////////////////////////////////////////////////////////
////////// Getting The Products

class Products {
  // this asychrounous method will load
  // all product information asychrounously
  // while the browser renders the webpage

  async getProducts() {
    // prettier-ignore
    try {
        let result = await fetch('products.json');
        let data = await result.json(); 
        let products = data.items; 
        products = products.map(item => {
            const {title, price} = item.fields;
            const {id} = item.sys; 
            const image = item.fields.image.fields.file.url;
            return {title, price, id, image}
        })
        // returns all needed info from products.json
        return products
    } catch (error) {
        alert(error)
    }
  }
}

//////////////////////////////////////////////////////////////////////
////////// Getting & Displaying Products

class UI {
  displayProducts(products) {
    let result = "";
    products.forEach(product => {
      // Gets properties from returned Product class and inject into HTML template
      result += `
        <article class="product">
            <div class="img-container">
                <img
                    src="${product.image}"
                    alt="${product.title}"
                    title="${product.title}"
                    class="product-img"
                    width="279"
                    height="186"
                />
                <button class="bag-btn" data-id="${product.id}">
                <i class="fas fa-shopping-cart"></i>
                Add to Cart
                </button>
            </div>
            <h3>${product.title}</h3>
            <h4>$${product.price}</h4>
        </article>
        `;
    });
    // Inject new template into DOM
    productsDOM.innerHTML = result;
  }

  getBagButtons() {
    // the spread operator will return an array of buttons intead of node-list
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;

    buttons.forEach(button => {
      // if an item is in the cart we find it,
      // we then call a function which check if
      // there is a matching id attribute

      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);

      // "inCart" returns true || false
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }

      button.addEventListener("click", event => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;

        // get product from product array based on id attribute
        let cartItem = { ...Storage.getProduct(id), amount: 1 };

        // add that product to the cart
        cart = [...cart, cartItem];

        // save the cart in local storage
        Storage.saveCart(cart);

        // set cart values
        this.setCartValues(cart);

        // display cart items
        this.addCartItem(cartItem);

        // display cart on UI
        this.showCart();
      });
    });
  }

  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;

    cart.map(item => {
      // Set Cart & Item Totals
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    // Cart Total = fixed floating point number with 2 decimal points
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }

  addCartItem(item) {
    // Injects new html cart item template into DOM
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
    <img
        src="${item.image}"
        alt="${item.title}"
        title="${item.title}"
        width="75"
        height="75"
    />
    <div>
        <h4>${item.title}</h4>
        <h5>$${item.price}</h5>
        <span class="remove-item" data-id="${item.id}">remove</span>
    </div>
    <div>
        <i class="fas fa-chevron-up" data-id="${item.id}"></i>
        <p class="item-amount">${item.amount}</p>
        <i class="fas fa-chevron-down" data-id="${item.id}"></i>
    </div>
    `;
    cartContent.appendChild(div);
  }

  showCart() {
    // Display cart bu adding CSS classes
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }

  hideCart() {
    // Hide cart by removing CSS class
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }

  populateCart(cart) {
    cart.forEach(item => this.addCartItem(item));
  }

  cartLogic() {
    // select the clear cart button
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });

    // cart functionality using event bubbling
    // to select remove && select OR decrease buttons

    cartContent.addEventListener("click", event => {
      if (event.target.classList.contains("remove-item")) {
        // get data set attribute of
        // remove button and remove
        // item from DOM
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);
      } else if (event.target.classList.contains("fa-chevron-up")) {
        // get dataset attribute of up
        // arrow and add to the total
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount + 1;

        // update local storage
        Storage.saveCart(cart);
        this.setCartValues(cart);

        // Up arrow adding amount to cart
        addAmount.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        // lower amont
        tempItem.amount = tempItem.amount - 1;

        // remove if tempItem.amount is 0
        if (tempItem.amount > 0) {
          // lower value & totals for cart
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.amount;
        } else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }

  clearCart() {
    // Get all id's of items currently in cart
    let cartItems = cart.map(item => item.id);

    // Loop over cartItems array then remove item with specific id
    cartItems.forEach(id => this.removeItem(id));

    console.log(cartContent.children);
    // While there are children of the
    // .cart-content class, remove them
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }

    this.hideCart();
  }

  removeItem(id) {
    // filter through array
    // return all item ids that
    // dont match the given id

    cart = cart.filter(item => item.id !== id);

    // update cart values
    this.setCartValues(cart);

    // save info in local storage
    Storage.saveCart(cart);

    // make sure the 'in cart' transitions to 'add to cart'
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>Add to Cart`;
  }

  getSingleButton(id) {
    // get and return the button with
    // the matching data set id of item
    // that was removed || added from || to the cart
    return buttonsDOM.find(button => button.dataset.id === id);
  }

  setupApp() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
  }
}

//////////////////////////////////////////////////////////////////////
////////// Local Storage

class Storage {
  // If you refresh the page, items will stay in cart
  // You can find these within Google Dev Console > Application > Local Storage

  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    // Only returns the product if the id matches the passed in id
    return products.find(product => product.id === id);
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

//////////////////////////////////////////////////////////////////////
////////// Global App Controller

const App = () => {
  const ui = new UI();
  const products = new Products();

  // setup application
  ui.setupApp();

  // get all products
  products
    .getProducts()
    .then(products => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });
};

//////////////////////////// Backwards Compatible IIFE Global App Controller

if (document.addEventListener) {
  document.addEventListener("onDOMContentLoaded", App(), false);
} else if (window.attachEvent) {
  window.attachEvent("onload", App());
}
