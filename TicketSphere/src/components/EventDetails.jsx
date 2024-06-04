import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './details.css';
import GooglePayButton from '@google-pay/button-react';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/tickets/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    fetchEvent();
  }, [id]);

  const handleContactSeller = () => {
    const sellerPhoneNumber = event.phoneNumber; 
    const whatsappLink = `https://wa.me/${sellerPhoneNumber}`;
    window.open(whatsappLink, '_blank');
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="event-details">
        <img src={event.poster} alt={event.eventName} className="event-image" />
        <div className="event-info">
          <h2>{event.eventName}</h2>
          <p>Location: {event.eventLocation}</p>
          <p>Category: {event.category}</p>
          <p>Price: ${event.price}</p>
          <p>Date: {new Date(event.date).toLocaleDateString()}</p>
          <p className="description">Description: {event.description}</p>
          <p className="seller">Listed by: {event.sellerName}</p>
          
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
                totalPrice: event.price.toString(),  // Use the ticket price from the event data
                currencyCode: 'INR',
                countryCode: 'IN',
              },
              shippingAddressRequired: true,
              callbackIntents: ['SHIPPING_ADDRESS', 'PAYMENT_AUTHORIZATION'],
            }}
            onLoadPaymentData={paymentRequest => {
              console.log('Success', paymentRequest);
            }}
            onPaymentAuthorized={paymentData => {
              console.log('Payment Authorised Success', paymentData);
              return { transactionState: 'SUCCESS' };
            }}
            onPaymentDataChanged={paymentData => {
              console.log('On Payment Data Changed', paymentData);
              return {};
            }}
            existingPaymentMethodRequired='false'
            buttonColor='black'
            buttonType='Buy'
            className="dark-google-pay-button"
          />
‎ ‎ ‎ ‎ ‎ ‎ 
          <button className="contact-seller-button" onClick={handleContactSeller}>
            Talk to seller
            
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
