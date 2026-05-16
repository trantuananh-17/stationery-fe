// import { Button } from '@/components/ui/button';
// import { ButtonGroup } from '@/components/ui/button-group';
// import { Field } from '@/components/ui/field';
// import { Input } from '@/components/ui/input';
// import { cn } from '@/lib/utils';
// import { Search } from 'lucide-react';

// function InputButtonGroup({ className }: React.ComponentProps<'input'>) {
//   return (
//     <div className={cn(className)}>
//       <Field>
//         <ButtonGroup>
//           <Input id='input-button-group' placeholder='Tìm kiếm sản phẩm' />
//           <Button variant='outline'>
//             <Search />
//           </Button>
//         </ButtonGroup>
//       </Field>
//     </div>
//   );
// }

// export { InputButtonGroup };

'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

function InputButtonGroup({ className }: React.ComponentProps<'input'>) {
  const router = useRouter();

  const [search, setSearch] = useState('');

  function handleSearch() {
    const keyword = search.trim();

    if (!keyword) {
      router.push('/products');
      return;
    }

    router.push(`/products?search=${encodeURIComponent(keyword)}`);
  }

  return (
    <div className={cn(className)}>
      <Field>
        <ButtonGroup>
          <Input
            id='input-button-group'
            placeholder='Tìm kiếm sản phẩm'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />

          <Button variant='outline' onClick={handleSearch}>
            <Search />
          </Button>
        </ButtonGroup>
      </Field>
    </div>
  );
}

export { InputButtonGroup };
