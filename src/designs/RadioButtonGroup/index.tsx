interface IRadioButtonGroupProps<T = any> {
  className?: string;
  optionSelected: T;
  label: string;
  options: T[];
  onSelect: (option: T) => void;
  disabled?: boolean;
  required?: boolean;
  /**
   * @description formTarget is key of option which will be chose in feature
   * @default formTarget = "_id"
   */
  formTarget: string;
  /**
   * @description optionTarget is key of option which will be displayed in feature
   * @default optionTarget = "name"
   */
  optionTarget: string;
}

const RadioButtonGroup: React.FC<IRadioButtonGroupProps> = (props) => {
  const {
    className,
    optionSelected,
    label,
    options,
    onSelect,
    required,
    disabled,
    optionTarget,
    formTarget,
  } = props;
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        <span className="ml-1 text-red-500">{required && '*'}</span>
      </label>
      <fieldset disabled={disabled} className="mt-3">
        <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
          {options?.map((option) => (
            <div
              key={(option as any)?.[formTarget]}
              className="flex items-center">
              <input
                id={(option as any)?.[formTarget]}
                name="notification-method"
                type="radio"
                onChange={() => {
                  onSelect && onSelect(option);
                }}
                checked={
                  (option as any)?.[formTarget] ===
                  (optionSelected as any)?.[formTarget]
                }
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <label
                htmlFor={(option as any)?.[formTarget]}
                className="block ml-3 text-sm font-medium text-gray-700">
                {(option as any)?.[optionTarget]}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
};

export default RadioButtonGroup;
