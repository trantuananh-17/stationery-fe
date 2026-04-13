import { ShoppingCart } from 'lucide-react';

function CartButton() {
  return (
    <button className='relative'>
      <ShoppingCart />
      <span className='bg-primary text-input absolute -top-1 -right-1 h-4 w-4 rounded-xl text-xs'>2</span>
    </button>
  );
}

export { CartButton };
