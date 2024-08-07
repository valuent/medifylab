import React from "react";
import { useState, useContext, useEffect } from "react";
import logo from "../assets/img/logo.svg";
import Fuse from "fuse.js";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Avatar,
  user,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { Card, CardBody } from "@nextui-org/react";
import { Link, useLocation } from "react-router-dom";

import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/config";
import { AuthContext } from "../utils/authContext.js";
import { DataContext } from "../utils/dataContext.js";

// import whatsapp from "../assets/img/whatsapp.svg";
import { db } from "../utils/config";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

function Navbar() {
  let { userInfo, isLoggedIn, userData } = useContext(AuthContext);
  const { products } = useContext(DataContext);
  const [cart, setCart] = useState([]);
  const location = useLocation();

  const [search, setSearch] = useState();
  const [results, setResults] = useState();

  useEffect(() => {
    if (products?.productsArray?.length > 0) {
      const fuse = new Fuse(products?.productsArray, {
        keys: ["name", "generic", "brand", "class"],
      });
      let results = fuse.search(search);
      setResults(results);
    }
  }, [search]);

  useEffect(() => {
    if (!isLoggedIn) {
      const cart = JSON.parse(localStorage.getItem("cart"));
      setCart(cart);
    } else if (userData?.cart) {
      setCart(userData?.cart);
    }

    if (isLoggedIn && userData) {
      let cart = [];
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      cart?.map(async (item) => {
        await updateDoc(doc(db, "users", userInfo?.uid), {
          cart: arrayUnion(item),
        });
        localStorage.clear();
      });
    }
  }, [isLoggedIn, userData]);

  const buttonStyle =
    "py-2.5 px-5 bg-transparent text-md text-white hover:bg-secondary hover:bg-opacity-80 rounded-lg duration-300 ease-in-out w-11/12 lg:w-auto";

  const buttonActiveStyle =
    "py-2.5 px-5 bg-transparent text-md text-white bg-secondary bg-opacity-80 rounded-lg duration-300 ease-in-out w-11/12 lg:w-auto";

  const handleLogout = () => {
    signOut(auth);
  };
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Modal
        size="5xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-primary">
                Search for products
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Search"
                  isClearable
                  radius="lg"
                  onChange={(e) => setSearch(e.target.value)}
                  classNames={{
                    label: "text-black/50 dark:text-white/90",
                    input: [
                      "bg-transparent",
                      "text-black/90 dark:text-white/90",
                      "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                    ],
                    innerWrapper: "bg-transparent",
                  }}
                  placeholder="Type to search..."
                  startContent={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      />
                    </svg>
                  }
                />
              </ModalBody>
              <ModalFooter>
                {results?.length > 0 ? (
                  <div className="flex flex-col w-full gap-y-1">
                    <span>Results</span>
                    {results?.map((result, index) => (
                      <div
                        key={index}
                        className="px-2 py-3 rounded border-b-1 hover:bg-secondary hover:bg-opacity-30"
                      >
                        <Link
                          to={`/product/${result.item.uuid}`}
                          onClick={() => {
                            setSearch("");
                            onClose();
                          }}
                        >
                          <div className="flex flex-row justify-between ">
                            <span className="w-1/4 text-sm text-gray-600 ">
                              {result.item.name}
                            </span>

                            <span className="w-1/4 text-sm text-right text-gray-600">
                              {result.item.brand}
                            </span>
                            <span className="w-1/4 text-sm text-right text-gray-600 ">
                              ${result.item.price}
                            </span>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : null}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <header className="flex flex-wrap w-full py-4 text-sm bg-zinc-800 lg:justify-start lg:flex-nowrap">
        <nav
          className="max-w-[85rem] w-full mx-auto px-4 lg:flex lg:items-center lg:justify-between"
          aria-label="Global"
        >
          <div className="flex items-center justify-between">
            <Link to="/">
              <div className="inline-flex items-center text-xl font-semibold gap-x-2">
                <img src={logo} alt="Logo" className="w-12 h-auto" />
                <div className="text-4xl text-primary font-displaylight">
                  medifylab
                </div>
              </div>
            </Link>

            <div className="lg:hidden ">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 text-white duration-100 ease-in-out rounded-lg shadow-sm bg-secondary bg-opacity-30 hs-collapse-toggle gap-x-2 hover:bg-opacity-40 disabled:opacity-50 disabled:pointer-events-none"
                data-hs-collapse="#navbar-image-and-text-1"
                aria-controls="navbar-image-and-text-1"
                aria-label="Toggle navigation"
              >
                <svg
                  className="flex-shrink-0 hs-collapse-open:hidden size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" x2="21" y1="6" y2="6" />
                  <line x1="3" x2="21" y1="12" y2="12" />
                  <line x1="3" x2="21" y1="18" y2="18" />
                </svg>
                <svg
                  className="flex-shrink-0 hidden hs-collapse-open:block size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div
            id="navbar-image-and-text-1"
            className="absolute left-0 z-30 hidden w-full pb-5 overflow-hidden transition-all duration-300 lg:p-0 bg-zinc-800 lg:bg-transparent lg:relative hs-collapse basis-full grow lg:block"
          >
            <div
              id="preline__collapse"
              className="flex flex-col items-center self-center justify-center gap-5 mx-auto mt-5 text-center lg:flex-row lg:items-end lg:justify-end lg:mt-0 lg:ps-5"
            >
              <Button color="secondary" variant="light" onPress={onOpen}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </Button>
              <Link to="/shop">
                <Button
                  className={
                    location.pathname === "/shop"
                      ? buttonActiveStyle
                      : buttonStyle
                  }
                >
                  Shop
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  className={
                    location.pathname === "/about"
                      ? buttonActiveStyle
                      : buttonStyle
                  }
                >
                  About
                </Button>
              </Link>
              <Link to="/contacts">
                <Button
                  className={
                    location.pathname === "/contacts"
                      ? buttonActiveStyle
                      : buttonStyle
                  }
                >
                  Contacts
                </Button>
              </Link>
              {!isLoggedIn ? (
                <>
                  <Link to="/login">
                    <Button
                      className={
                        location.pathname === "/login"
                          ? buttonActiveStyle
                          : buttonStyle
                      }
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      className={
                        location.pathname === "/register"
                          ? buttonActiveStyle
                          : buttonStyle
                      }
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              ) : null}

              <Link to="/cart">
                <Button
                  color="primary"
                  variant="flat"
                  className={
                    location.pathname === "/cart"
                      ? buttonActiveStyle
                      : buttonStyle
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className=" size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                  {cart?.length > 0 ? (
                    <div className="z-50 px-2 py-0.5 text-xs rounded-full text-textColor p- top-5 count bg-accent">
                      {cart?.length}
                    </div>
                  ) : null}
                </Button>
              </Link>

              {isLoggedIn ? (
                <Dropdown>
                  <DropdownTrigger>
                    <Avatar
                      className="duration-200 cursor-pointer bg-primary hover:bg-secondary"
                      size="md"
                    />
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem key="profile" variant="flat">
                      {userInfo?.email}
                    </DropdownItem>
                    <DropdownItem key="order">Orders</DropdownItem>

                    <DropdownItem key="logout" onClick={handleLogout}>
                      {" "}
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              ) : null}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
