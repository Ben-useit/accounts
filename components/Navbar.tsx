import Link from 'next/link';

const Navbar = () => {
  return (
    <div>
      {' '}
      <Link href='/client/new'>New Client</Link>
      <Link href='/'>Purchase</Link>
      <Link href='/'>Sales</Link>
    </div>
  );
};
export default Navbar;
