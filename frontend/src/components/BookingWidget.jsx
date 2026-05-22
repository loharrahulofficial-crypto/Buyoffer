const BookingWidget = ({ city = '' }) => (
  <div className="booking-widget-wrapper">
    <h3>Search Hotels on Booking.com</h3>
    <iframe
      src={`https://www.booking.com/flexiproduct.html?product=searchbox&aid=${import.meta.env.VITE_BOOKING_AID}&lang=en-gb&currency=INR&ss=${encodeURIComponent(city)}`}
      width="100%"
      height="200"
      frameBorder="0"
      scrolling="no"
      title="Search Hotels"
    />
  </div>
)

export default BookingWidget
