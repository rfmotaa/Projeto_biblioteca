import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from './ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { cn } from './ui/utils';

interface SearchableSelectProps<T> {
  items: T[];
  value: string;
  onChange: (value: string) => void;
  getLabel: (item: T) => string;
  getValue: (item: T) => string;
  getSubtitle?: (item: T) => string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
}

export function SearchableSelect<T>({
  items,
  value,
  onChange,
  getLabel,
  getValue,
  getSubtitle,
  placeholder = 'Selecione uma opção',
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'Nenhuma opção encontrada.',
  className,
}: SearchableSelectProps<T>) {
  const [open, setOpen] = useState(false);

  const selectedItem = items.find((item) => getValue(item) === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          {selectedItem ? (
            <div className="flex flex-col items-start">
              <span>{getLabel(selectedItem)}</span>
              {getSubtitle && (
                <span className="text-xs text-muted-foreground">
                  {getSubtitle(selectedItem)}
                </span>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={getValue(item)}
                  value={getLabel(item)}
                  onSelect={() => {
                    onChange(getValue(item));
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-col items-start flex-1">
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === getValue(item) ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <span>{getLabel(item)}</span>
                    {getSubtitle && (
                      <span className="text-xs text-muted-foreground ml-6">
                        {getSubtitle(item)}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
