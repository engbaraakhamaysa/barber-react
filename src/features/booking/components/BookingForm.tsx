import { useState } from "react";

import { useCreateCustomer } from "../../customer/hooks/useCreateCustomer";

import { useBookingSlots } from "../hooks/useBookingSlots";
import { useCreateBooking } from "../hooks/useCreateBooking";

import BookingSlotSelector from "./BookingSlotSelector";

import "./booking-form.css";

interface BookingFormProps {
  barberId: number;
  onSuccess: () => void;
}

export default function BookingForm({ barberId, onSuccess }: BookingFormProps) {
  const {
    createCustomer,
    loading: creatingCustomer,
    error: customerError,
  } = useCreateCustomer();

  const {
    slots,
    loading: slotsLoading,
    error: slotsError,
    refreshSlots,
  } = useBookingSlots(barberId);

  const {
    createBooking,
    loading: creatingBooking,
    error: bookingError,
  } = useCreateBooking();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  const loading = creatingCustomer || creatingBooking || slotsLoading;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selectedSlotId === null) {
      return;
    }

    const customer = await createCustomer({
      name,
      phone: phone || null,
    });

    if (!customer) {
      return;
    }

    const booking = await createBooking({
      customer_id: customer.id,
      slot_id: selectedSlotId,
    });

    if (!booking) {
      return;
    }

    setName("");
    setPhone("");
    setSelectedSlotId(null);

    await refreshSlots();

    onSuccess();
  }

  return (
    <section className="book-card">
      <h2 className="book-card__title">Book Appointment</h2>

      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="booking-name">Customer Name</label>

          <input
            id="booking-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter customer name"
            autoComplete="name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="booking-phone">Phone</label>

          <input
            id="booking-phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Enter customer phone"
            autoComplete="tel"
          />
        </div>

        <section className="booking-slots">
          {slotsLoading && (
            <p className="booking-message">Loading available times...</p>
          )}

          {slotsError && (
            <p className="booking-message booking-message--error">
              {slotsError}
            </p>
          )}

          {!slotsLoading && !slotsError && (
            <BookingSlotSelector
              slots={slots}
              selectedSlotId={selectedSlotId}
              onSelect={setSelectedSlotId}
            />
          )}
        </section>

        {customerError && <p className="booking-error">{customerError}</p>}

        {bookingError && <p className="booking-error">{bookingError}</p>}

        <button
          className="submit-button"
          type="submit"
          disabled={loading || selectedSlotId === null}
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </section>
  );
}
