import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './details.css';
import { Modal, Select, Alert, Button } from 'antd';
import GooglePayButton from '@google-pay/button-react';
import { useUser } from "@clerk/clerk-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from "framer-motion";
import Loader from './loader';

const { Option } = Select;

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedValues, setSelectedValues] = useState({});
  const [error, setError] = useState(null);
  const { isSignedIn, user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`https://ticketsphere.onrender.com/tickets/${id}`);
        setEvent(response.data);
        setTimeout(() => {
          setLoading(false);
        }, 1200);
      } catch (error) {
        setError('Error fetching event details.');
        console.error('Error fetching event details:', error);
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleContactSeller = () => {
    const sellerPhoneNumber = event.phoneNumber;
    const whatsappLink = `https://wa.me/${sellerPhoneNumber}`;
    window.open(whatsappLink, '_blank');
  };

  const handlePaymentAuthorized = async (paymentData) => {
    try {
      const buyerName = user.username || user.fullName;
  
      const transactionData = {
        eventName: event.eventName,
        sellerName: event.sellerName,
        buyerName: buyerName,
        location: event.eventLocation,
        category: event.category,
        quantity: selectedValues.quantity,
        totalPrice: selectedValues.totalPrice,
        poster: event.poster,
      };
  
      console.log('Transaction Data:', transactionData); 
  
      await axios.post('https://ticketsphere.onrender.com/buys', transactionData);
  
      await axios.put(`https://ticketsphere.onrender.com/update-quantity/${event._id}`, { quantity: selectedValues.quantity });
  
      toast.success('Ticket successfully bought!', {
        autoClose: 1200,
      });

      setIsModalVisible(false);

      setTimeout(() => {
        navigate('/dashboard/#bought-tickets-section');
      }, 2000); 
      
      return { transactionState: 'SUCCESS' };
    } catch (error) {
      console.error('Error saving transaction details or updating event remainingQuantity:', error);
      toast.error('Error occurred while buying ticket.', {
        autoClose: 1200,
      });
      return { transactionState: 'ERROR' };
    }
  };

  const handleLoginModalOk = () => {
    setIsLoginModalVisible(false);
    navigate(`/sign-in?eventId=${id}`);
  };

  const showModal = () => {
    if (isSignedIn) {
      setIsModalVisible(true);
    } else {
      setIsLoginModalVisible(true);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsLoginModalVisible(false);
    setCurrentStep(1); 
  };

  const handleQuantityChange = (value) => {
    setQuantity(value);
  };

  const handleConfirm = () => {
    const totalPrice = (event.price * quantity).toFixed(2);
    setSelectedValues({ quantity, totalPrice });
    setCurrentStep(2);
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (loading || !event || !isLoaded) {
    return <Loader />;
  }

  const renderBuyButton = () => {
    return (
      <Link onClick={showModal} className="fancy buy-tickets-button">
        <span className="top-key"></span>
        <span className="text">Buy</span>
        <span className="bottom-key-1"></span>
        <span className="bottom-key-2"></span>
      </Link>
    );
  };

  return (
    <>
      <img src={event.poster} alt="" className="bg-image" />
      <div className="container">
        <ToastContainer />
        <div className="event-details">
          <motion.div whileHover={{ scale: 1.1 }}>
            <img src={event.poster} alt={event.eventName} className="event-image" />
          </motion.div>
          <div className="event-info">
            <h2>{event.eventName}</h2>
            <p>Location: {event.eventLocation}</p>
            <p>Category: {event.category}</p>
            <p>Price: ₹{event.price}</p>
            <p>Available Quantity: {event.remainingQuantity}</p>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p className="description">Description: {event.description}</p>
            <p className="seller">Listed by: {event.sellerName}</p>

            {renderBuyButton()}

            <Modal title="Buy Tickets" visible={isModalVisible} onCancel={handleCancel} footer={null}>
              {currentStep === 1 ? (
                <div>
                  <label>
                    Quantity:
                    <Select defaultValue={quantity} onChange={handleQuantityChange} style={{ width: 120, marginLeft: 10 }}>
                      {[...Array(event.remainingQuantity).keys()].map((num) => (
                        <Option key={num + 1} value={num + 1}>
                          {num + 1}
                        </Option>
                      ))}
                    </Select>
                  </label>
                  <p>Total Price: ₹{(event.price * quantity).toFixed(2)}</p>
                  <Alert message="Please proceed with payment only if you have already spoken to the seller." type="warning" />
                  <br />
                  <div class="button-borders">
                    <button class="primary-button" type="primary"onClick={handleConfirm}> 
                      Confirm
                    </button>
                  </div>
                  
                </div>
              ) : (
                <div>
                   <p>Quantity: {event.remainingQuantity}</p>
                  <p>Total Price: ₹{selectedValues.totalPrice}</p>
                  <p>Location: {event.eventLocation}</p>
                  <Alert message="Please proceed with payment only if you have already spoken to the seller." type="warning" />
                  <br />
                  <GooglePayButton
                    environment="TEST"
                    paymentRequest={{
                      apiVersion: 2,
                      apiVersionMinor: 0,
                      allowedPaymentMethods: [
                        {
                          type: 'CARD',
                          parameters: {
                            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                            allowedCardNetworks: ['MASTERCARD', 'VISA'],
                          },
                          tokenizationSpecification: {
                            type: 'PAYMENT_GATEWAY',
                            parameters: {
                              gateway: 'example',
                              gatewayMerchantId: 'exampleGatewayMerchantId',
                            },
                          },
                        },
                      ],
                      merchantInfo: {
                        merchantId: '12345678901234567890',
                        merchantName: 'Demo Merchant',
                      },
                      transactionInfo: {
                        totalPriceStatus: 'FINAL',
                        totalPriceLabel: 'Total',
                        totalPrice: selectedValues.totalPrice,
                        currencyCode: 'INR',
                        countryCode: 'IN',
                      },
                      shippingAddressRequired: true,
                      callbackIntents: ['SHIPPING_ADDRESS', 'PAYMENT_AUTHORIZATION'],
                    }}
                    onLoadPaymentData={(paymentRequest) => {
                      console.log('Success', paymentRequest);
                    }}
                    onPaymentAuthorized={handlePaymentAuthorized}
                    onPaymentDataChanged={(paymentData) => {
                      console.log('On Payment Data Changed', paymentData);
                      return {};
                    }}
                    existingPaymentMethodRequired="false"
                    buttonColor="black"
                    buttonType="Buy"
                    className="dark-google-pay-button"
                  />
                  
                </div>
              )}
            </Modal>

            <Modal
              title="Login Required"
              open={isLoginModalVisible}
              onOk={handleLoginModalOk}
              onCancel={handleCancel}
              footer={[
                <Link to={`/sign-in?eventId=${id}`} key="login-link">
                  <Button>
                    Go to Sign In
                  </Button>
                </Link>,
              ]}
            >
              <p>Please log in to proceed with buying tickets.</p>
            </Modal>
            <button className="contact-seller-button" onClick={handleContactSeller}>
              Talk to seller
              <svg viewBox="0 0 48 48" y="0px" x="0px" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z" fill="#fff"></path>
              <path d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z" fill="#fff"></path>
              <path d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z" fill="#cfd8dc"></path>
              <path d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z" fill="#40c351"></path>
              <path clipRule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" fillRule="evenodd" fill="#fff"></path>
            </svg>  
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetails;
