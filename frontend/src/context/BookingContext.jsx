import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [bookingState, setBookingState] = useState({
    selectedCategory: null,
    selectedCity: null,
    selectedArea: null,
    selectedProvider: null,
    selectedService: null,
    selectedSlot: null,       // { date, time }
    address: '',
    pincode: '',
    notes: '',
    paymentMode: 'cod',       // 'cod' | 'razorpay'
    vehicleDetails: null,     // { make, model, year }
    currentStep: 1            // 1-6
  });

  const setCategory = (category) => {
    setBookingState(prev => ({
      ...prev,
      selectedCategory: category
    }));
  };

  const setLocation = (city, area) => {
    setBookingState(prev => ({
      ...prev,
      selectedCity: city,
      selectedArea: area
    }));
  };

  const setProvider = (provider) => {
    setBookingState(prev => ({
      ...prev,
      selectedProvider: provider
    }));
  };

  const setService = (service) => {
    setBookingState(prev => ({
      ...prev,
      selectedService: service
    }));
  };

  const setSlot = (date, time) => {
    setBookingState(prev => ({
      ...prev,
      selectedSlot: date || time ? { date, time } : null
    }));
  };

  const setAddressDetails = (address, pincode, notes) => {
    setBookingState(prev => ({
      ...prev,
      address,
      pincode,
      notes
    }));
  };

  const setVehicleDetails = (make, model, year) => {
    setBookingState(prev => ({
      ...prev,
      vehicleDetails: (make || model || year) ? { make, model, year } : null
    }));
  };

  const setPaymentMode = (mode) => {
    setBookingState(prev => ({
      ...prev,
      paymentMode: mode
    }));
  };

  const nextStep = () => {
    setBookingState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 6)
    }));
  };

  const prevStep = () => {
    setBookingState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1)
    }));
  };

  const resetBooking = () => {
    setBookingState({
      selectedCategory: null,
      selectedCity: null,
      selectedArea: null,
      selectedProvider: null,
      selectedService: null,
      selectedSlot: null,
      address: '',
      pincode: '',
      notes: '',
      paymentMode: 'cod',
      vehicleDetails: null,
      currentStep: 1
    });
  };

  const value = {
    ...bookingState,
    setCategory,
    setLocation,
    setProvider,
    setService,
    setSlot,
    setAddressDetails,
    setVehicleDetails,
    setPaymentMode,
    nextStep,
    prevStep,
    resetBooking
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export default BookingContext;
