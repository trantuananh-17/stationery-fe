import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

function InputButtonGroup({ className }: React.ComponentProps<'input'>) {
  return (
    <div className={cn(className)}>
      <Field>
        <ButtonGroup>
          <Input id='input-button-group' placeholder='Tìm kiếm sản phẩm' />
          <Button variant='outline'>
            <Search />
          </Button>
        </ButtonGroup>
      </Field>
    </div>
  );
}

export { InputButtonGroup };
