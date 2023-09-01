'use client';
import * as React from 'react';

const RE_DIGIT = new RegExp(/^\d+$/);

type OTPProps = {
  value: string;
  valueLength: number;
  onChange: (value: string) => void;
};

function OTP({ value, valueLength, onChange }: OTPProps) {
  const valueItems = React.useMemo(() => {
    const valueArray = value.split('');
    const items: Array<string> = [];

    for (let i = 0; i < valueLength; i++) {
      const char = valueArray[i];

      if (RE_DIGIT.test(char)) {
        items.push(char);
      } else {
        items.push('');
      }
    }

    return items;
  }, [value, valueLength]);

  const focusToNextInput = (target: HTMLElement) => {
    const nextElementSibling = target.nextElementSibling as HTMLInputElement | null;

    if (nextElementSibling) {
      nextElementSibling.focus();
    }
  };
  const focusToPrevInput = (target: HTMLElement) => {
    const previousElementSibling = target.previousElementSibling as HTMLInputElement | null;

    if (previousElementSibling) {
      previousElementSibling.focus();
    }
  };

  const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const target = e.target;
    let targetValue = target.value.trim();
    const isTargetValueDigit = RE_DIGIT.test(targetValue);

    if (!isTargetValueDigit && targetValue !== '') {
      return;
    }
    if (!isTargetValueDigit && targetValue !== '') {
      return;
    }

    const nextInputEl = target.nextElementSibling as HTMLInputElement | null;

    // only delete digit if next input element has no value
    if (!isTargetValueDigit && nextInputEl && nextInputEl.value !== '') {
      return;
    }

    targetValue = isTargetValueDigit ? targetValue : ' ';

    const targetValueLength = targetValue.length;

    if (targetValueLength === 1) {
      const newValue = value.substring(0, idx) + targetValue + value.substring(idx + 1);

      onChange(newValue);

      if (!isTargetValueDigit) {
        return;
      }

      focusToNextInput(target);

      const nextElementSibling = target.nextElementSibling as HTMLInputElement | null;

      if (nextElementSibling) {
        nextElementSibling.focus();
      }
    } else if (targetValueLength === valueLength) {
      onChange(targetValue);

      target.blur();
    }
  };

  const inputOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    const target = e.target as HTMLInputElement;

    const targetValue = target.value;

    if (key === 'ArrowRight' || key === 'ArrowDown') {
      e.preventDefault();
      return focusToNextInput(target);
    }

    if (key === 'ArrowLeft' || key === 'ArrowUp') {
      e.preventDefault();
      return focusToPrevInput(target);
    }

    // keep the selection range position
    // if the same digit was typed
    target.setSelectionRange(0, targetValue.length);

    if (e.key !== 'Backspace' || target.value !== '') {
      return;
    }

    const previousElementSibling = target.previousElementSibling as HTMLInputElement | null;

    if (previousElementSibling) {
      previousElementSibling.focus();
    }

    if (e.key !== 'Backspace' || targetValue !== '') {
      return;
    }

    focusToPrevInput(target);
  };

  const inputOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { target } = e;

    // keep focusing back until previous input
    // element has value
    const prevInputEl = target.previousElementSibling as HTMLInputElement | null;

    if (prevInputEl && prevInputEl.value === '') {
      return prevInputEl.focus();
    }

    target.setSelectionRange(0, target.value.length);
  };

  return (
    <div className='flex w-full max-w-sm gap-x-3'>
      {valueItems.map((digit, idx) => (
        <input
          key={idx}
          type='text'
          inputMode='numeric'
          autoComplete='one-time-code'
          pattern='\d{1}'
          maxLength={valueLength}
          className='w-full h-16 border-gray-800 text-center rounded-md text-4xl font-bold border'
          value={digit}
          onChange={e => inputOnChange(e, idx)}
          onKeyDown={inputOnKeyDown}
          onFocus={inputOnFocus}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [otp, setOtp] = React.useState('');
  return (
    <div className='w-full max-w-3xl mx-auto px-4 py-5'>
      <h1>Hi Bulldogs!</h1>
      <h2>Test Code: 123456</h2>
      <OTP value={otp} valueLength={6} onChange={setOtp} />
    </div>
  );
}
