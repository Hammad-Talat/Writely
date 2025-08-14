import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";

function ChevronIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 111.04 1.08l-4.24 3.36a.75.75 0 01-.94 0L5.25 8.31a.75.75 0 01-.02-1.1z" clipRule="evenodd" />
    </svg>
  );
}
function CheckIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.415l-7.01 7.01a1 1 0 01-1.414 0l-3.29-3.29A1 1 0 116.704 9.01l2.585 2.585 6.302-6.303a1 1 0 011.113-.003z" clipRule="evenodd" />
    </svg>
  );
}


export default function Select({ value, onChange, options, className = "" }) {
  const current = options.find(o => o.value === value) || options[0];

  return (
    <Listbox value={current.value} onChange={onChange}>
      <div className="relative w-44">
        <Listbox.Button
          className={
            "w-full cursor-default rounded-xl bg-white/10 py-2.5 pl-4 pr-9 text-left text-white ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-white/30 " +
            className
          }
        >
          <span className="block truncate">{current.label}</span>
          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-white/70">
            <ChevronIcon />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-40 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-neutral-900/95 p-1 shadow-2xl ring-1 ring-white/10 backdrop-blur focus:outline-none">
            {options.map((opt) => (
              <Listbox.Option
                key={opt.value}
                value={opt.value}
                className={({ active, selected }) =>
                  "relative cursor-default select-none rounded-lg px-3 py-2 text-sm " +
                  (active ? "bg-white/10" : "") +
                  " " +
                  (selected ? "text-white" : "text-white/90")
                }
              >
                {({ selected }) => (
                  <>
                    <span className="block truncate">{opt.label}</span>
                    {selected && (
                      <span className="absolute inset-y-0 right-2 flex items-center text-white/80">
                        <CheckIcon />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
