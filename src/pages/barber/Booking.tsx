import { useAuthContext } from "../../app/providers/AuthProvider";

import BookingForm from "../../features/booking/components/BookingForm";

import { useBarberBookings } from "../../features/booking/hooks/useBarberBookings";

import "./styles/booking.css";

export default function Booking() {
  const { user } = useAuthContext();

  if (!user) {
    return <p>Loading...</p>;
  }

  return <BookingPage barberId={user.id} />;
}

interface BookingPageProps {
  barberId: number;
}

function BookingPage({ barberId }: BookingPageProps) {
  const {
    bookings,
    loading: bookingsLoading,
    error: bookingsError,
    refreshBookings,
  } = useBarberBookings(barberId);

  console.log(bookings);

  async function handleBookingSuccess() {
    await refreshBookings();
  }
  return (
    <main className="booking-page">
      <header className="booking-page__header">
        <h1 className="booking-page__title">Bookings</h1>
        <p className="booking-page__subtitle">
          Manage your appointments and today's schedule.
        </p>
      </header>

      <div className="booking-page__content">
        {/* CREATE BOOKING */}
        <div className="booking-page__form">
          <BookingForm barberId={barberId} onSuccess={handleBookingSuccess} />
        </div>

        {/* TODAY'S BOOKINGS */}
        <section className="today-bookings">
          <div className="today-bookings__header">
            <h2 className="today-bookings__title">Today's Bookings</h2>
          </div>

          {bookingsLoading && (
            <p className="today-bookings__message">Loading bookings...</p>
          )}

          {bookingsError && (
            <p className="today-bookings__message today-bookings__message--error">
              {bookingsError}
            </p>
          )}

          {!bookingsLoading && !bookingsError && bookings.length === 0 && (
            <p className="today-bookings__message">No bookings yet.</p>
          )}

          {!bookingsLoading && !bookingsError && bookings.length > 0 && (
            <div className="today-bookings__list">
              {bookings.map((booking) => (
                <article className="booking-item" key={booking.id}>
                  <h3 className="booking-item__name">
                    {booking.customer_name ?? "Unknown Customer"}
                  </h3>

                  <p className="booking-item__phone">
                    {booking.customer_phone ?? "No phone number"}
                  </p>

                  <p className="booking-item__time">
                    {new Date(booking.slot_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <p className="booking-item__status">{booking.status}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
