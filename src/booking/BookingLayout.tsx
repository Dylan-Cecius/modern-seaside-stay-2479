import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import s from './Booking.module.css';
export default function BookingLayout({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  return <div className={s.shell} data-booking-shell><header className={s.header}><Link className={s.brand} to='/'>LA BARBE<br/>À PAPA<span>.</span></Link><nav aria-label='Navigation réservation'><Link to='/'><ArrowLeft aria-hidden='true'/> Le salon</Link><Link to={admin ? '/reservation' : '/admin'}>{admin ? 'Réservation' : 'Administration'}</Link></nav></header>{children}</div>;
}
