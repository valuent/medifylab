import React from "react";
import { useEffect, useState } from "react";
import { Button, user } from "@nextui-org/react";

import Cartcard from "./Cartcard";
import { DataContext } from "../utils/dataContext";
import { AuthContext } from "../utils/authContext.js";
import { useContext } from "react";

import { v4 as uuidv4 } from "uuid";
import { Navigate } from "react-router-dom";
function Cartpanel() {
  const { userInfo, isLoggedIn, userData } = useContext(AuthContext);
  const { products } = useContext(DataContext);
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingIndia, setShippingIndia] = useState(0);
  const [shippingUs, setShippingUs] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) {
      const productDetails = JSON.parse(localStorage.getItem("cart"));
      setCart(productDetails);
    } else {
      setCart(userData?.cart);
    }
  }, [isLoggedIn, userData]);

  useEffect(() => {
    function checkRoutes(array) {
      let hasIntous = false;
      let hasUstous = false;
      setShippingIndia(0);
      setShippingUs(0);

      if (array?.length > 0) {
        for (const obj of array) {
          if (obj.route === "intous") {
            hasIntous = true;
          } else if (obj.route === "ustous") {
            hasUstous = true;
          }

          // setSubtotal(obj.qty * productDetails?.discount + Subtotal);
        }
      }

      if (hasIntous) {
        setShippingIndia(40);
      }

      if (hasUstous) {
        setShippingUs(70);
      }
    }
    if (!userData?.cart) {
      checkRoutes(cart);
    } else {
      checkRoutes(userData?.cart);
    }

    function calculateTotal(array) {
      const subtotal = array?.reduce((total, item) => {
        const itemTotal = item.qty * item.price * item.pack;
        return total + itemTotal;
      }, 0);
      console.log(subtotal);
      setSubtotal(subtotal);
    }

    if (!userData?.cart) {
      calculateTotal(cart);
    } else {
      calculateTotal(userData?.cart);
    }
  }, [cart, userData]);

  const handlePlaceOrder = async () => {
    if (cart?.length > 0) {
      const order = {
        orderId: uuidv4(),

        products: cart,
        total: subtotal,
        shippingIndia: shippingIndia,
        shippingUs: shippingUs,
      };
      window.location.href =
        "/checkout?orderId=" +
        order.orderId +
        "&products=" +
        JSON.stringify(order.products) +
        "&total=" +
        order.total +
        "&shippingIndia=" +
        order.shippingIndia +
        "&shippingUs=" +
        order.shippingUs +
        "&checkOutFrom=" +
        "cart";
    }
  };

  return (
    <>
      <div className="w-3/5 pl-3 mx-auto mt-5 mb-10 text-center lg:mb-6">
        <h2 className="text-3xl font-bold md:text-4xl md:leading-tight text-primary">
          Shopping cart
        </h2>
        {userData?.cart?.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">Your cart is empty</p>
        ) : (
          <p className="mt-2 text-sm text-gray-500">
            Your cart contains{" "}
            {isLoggedIn ? userData?.cart?.length : cart?.length} item(s)
          </p>
        )}

        {/* <hr className="mt-3 border-gray-200" /> */}
      </div>

      <div className="flex flex-col justify-center w-full mb-10 lg:flex-row">
        <div className="w-full lg:w-3/5">
          {isLoggedIn == true
            ? userData?.cart
                ?.sort((a, b) => a.pack - b.pack)
                ?.map((item, index) => (
                  <Cartcard
                    cartpid={item.cartpid}
                    key={index}
                    pid={item.uuid}
                    qty={item.qty}
                    price={item.price}
                    route={item.route}
                    pack={item.pack}
                  />
                ))
            : cart
                ?.sort((a, b) => a.pack - b.pack)
                ?.map((item, index) => (
                  <Cartcard
                    cartpid={item.cartpid}
                    key={index}
                    pid={item.uuid}
                    price={item.price}
                    qty={item.qty}
                    route={item.route}
                    pack={item.pack}
                  />
                ))}
        </div>
        {cart?.length > 0 ? (
          <div className="flex flex-col w-11/12 p-10 mx-auto lg:mr-5 lg:mx-0 lg:w-2/5 bg-opacity-30 h-fit rounded-xl md:sticky top-10 bg-accent xl:w-1/4 gap-y-5">
            <p className="text-xl font-semibold">Order summary</p>
            <span className="flex justify-between">
              <p>Subtotal</p>
              <p className="">${parseFloat(subtotal).toFixed(2)}</p>
            </span>
            <hr />
            {shippingIndia > 0 ? (
              <span className="flex items-center justify-between text-sm">
                <p>
                  Shipping India to US
                  <p className="text-xs">15-21 working days.</p>
                </p>
                <p className="">${parseFloat(shippingIndia).toFixed(2)}</p>
              </span>
            ) : null}

            {shippingUs > 0 ? (
              <span className="flex items-center justify-between text-sm">
                <p>
                  Shipping US to US
                  <p className="text-xs">7-10 Working days.</p>
                </p>
                <p className="">${parseFloat(shippingUs).toFixed(2)}</p>
              </span>
            ) : null}

            <hr />
            <span className="flex justify-between ">
              <p>Total Shipping</p>
              <p className="">
                ${(parseInt(shippingIndia) + parseInt(shippingUs)).toFixed(2)}
              </p>
            </span>
            <hr />

            <span className="flex justify-between text-xl font-semibold">
              <p>Total</p>
              <p className="">
                ${parseFloat(subtotal + shippingIndia + shippingUs).toFixed(2)}
              </p>
            </span>
            <Button
              color="secondary"
              onClick={handlePlaceOrder}
              className="w-full mt-5"
            >
              Place order
            </Button>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default Cartpanel;
