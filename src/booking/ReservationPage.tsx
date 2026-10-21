import BookingLayout from './BookingLayout';
import ReservationForm from './ReservationForm';
import s from './Booking.module.css';
export default function ReservationPage(){return <BookingLayout><div className={s.heading}><p className={s.eyebrow}>Test · Décembre 2026 uniquement</p><h1>VOTRE PROCHAIN<br/><em>RENDEZ-VOUS.</em></h1><p>La Barbe à Papa · Rue de Jace 189, Jemeppe-sur-Meuse</p></div><ReservationForm/></BookingLayout>;}
