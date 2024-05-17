import { Switch } from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
interface ISwitchButton {
  initValue: boolean;
  onToggle: (value: boolean) => void;
  label: string;
  className?: string;
}
const SwitchButton = (props: ISwitchButton) => {
  const { initValue, onToggle, label = '', className } = props;

  return (
    <div className={className}>
      <div className="flex flex-col">
        {label && (
          <label className="block text-sm font-medium text-left text-gray-700">
            {label}
          </label>
        )}
        <Switch
          checked={initValue}
          onChange={onToggle}
          className={classNames(
            initValue ? 'bg-sky-500' : 'bg-gray-200',
            'relative inline-flex h-6 w-11 flex-shrink-0 mt-1 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:none'
          )}>
          <span
            aria-hidden="true"
            className={classNames(
              initValue ? 'translate-x-5' : 'translate-x-0',
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
            )}
          />
        </Switch>
      </div>
    </div>
  );
};
export default SwitchButton;
