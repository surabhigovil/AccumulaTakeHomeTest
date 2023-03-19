import React, { Component } from "react";
import { Routes, Route, Link, BrowserRouter as Router } from "react-router-dom";
import axios from 'axios';

import Cart from './components/Cart';
import ProductList from './components/ProductList';

import Context from "./Context";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      cart: {},
      products: [],
      selectedDate: null
    };
    this.routerRef = React.createRef();
  }

  async componentDidMount() {
    let cart = localStorage.getItem("cart");

    const products = await axios.get('http://localhost:3001/products');
    cart = cart? JSON.parse(cart) : {};

    this.setState({ products: products.data, cart});
  }

  addToCart = cartItem => {
    let cart = this.state.cart;
    if (cart[cartItem.id]) {
      cart[cartItem.id].amount += cartItem.amount;
    } else {
      cart[cartItem.id] = cartItem;
    }
    if (cart[cartItem.id].amount > cart[cartItem.id].product.inventoryQuantity) {
      cart[cartItem.id].amount = cart[cartItem.id].product.inventoryQuantity;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    this.setState({ cart });
  };

  clearCart = () => {
    let cart = {};
    localStorage.removeItem("cart");
    this.setState({ cart });
  };

  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
          addToCart: this.addToCart,
          clearCart: this.clearCart,
        }}
      >
        <Router ref={this.routerRef}>
        <div className="App">
          <nav
            className="navbar container"
            role="navigation"
            aria-label="main navigation"
          >
            <div className="navbar-brand">
              <b className="navbar-item is-size-4 ">Product Site</b>
              <label
                role="button"
                className="navbar-burger burger"
                aria-label="menu"
                aria-expanded="false"
                data-target="navbarBasicExample"
                onClick={e => {
                  e.preventDefault();
                  this.setState({ showMenu: !this.state.showMenu });
                }}
              >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </label>
            </div>
              <div className={`navbar-menu ${
                  this.state.showMenu ? "is-active" : ""
                }`}>
                <Link to="/products" className="navbar-item">
                  Products
                </Link>
                <Link to="/cart" className="navbar-item">
                  Cart
                </Link>
              </div>
            </nav>
            <Routes>
              <Route exact path="/" element={<ProductList />}></Route>
              <Route exact path="/cart" element={<Cart />}></Route>
              <Route exact path="/products" element={<ProductList />}></Route>
            </Routes>
          </div>
        </Router>
      </Context.Provider>
    );
  }
}