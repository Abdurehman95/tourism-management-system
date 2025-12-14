# PhoneInput Component

A reusable React component for phone number input with international country code selection.

## Features

- 🌍 **International Support**: Fetches all countries from REST Countries API
- 🇪🇹 **Ethiopia Default**: Automatically selects Ethiopia (+251) as the default country
- 🔍 **Searchable Dropdown**: Search countries by name or dial code
- 🎨 **Flag Display**: Shows country flags for easy identification
- ✨ **Smooth Animations**: Hover effects and transitions
- 📱 **Auto-formatting**: Automatically formats phone numbers with country code
- ♿ **Accessible**: Supports disabled state and required validation
- 🎯 **Easy Integration**: Simple props interface

## Usage

### Basic Example

```jsx
import PhoneInput from '../common/PhoneInput';

function MyForm() {
  const [phone, setPhone] = useState('');

  return (
    <PhoneInput
      value={phone}
      onChange={(value) => setPhone(value)}
      placeholder="Phone Number"
    />
  );
}
```

### With All Props

```jsx
<PhoneInput
  value={phoneNumber}
  onChange={(fullNumber) => setPhoneNumber(fullNumber)}
  placeholder="Enter your phone number"
  required={true}
  disabled={false}
  className="my-custom-class"
  style={{ marginBottom: '20px' }}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | string | `''` | The phone number value (can include or exclude country code) |
| `onChange` | function | - | Callback function that receives the full phone number with country code |
| `placeholder` | string | `'Phone Number'` | Placeholder text for the input field |
| `required` | boolean | `false` | Whether the field is required |
| `disabled` | boolean | `false` | Whether the input is disabled |
| `className` | string | `''` | Additional CSS class names |
| `style` | object | `{}` | Inline styles for the container |

## How It Works

1. **Fetches Countries**: On mount, fetches country data from `https://restcountries.com/v3.1/all`
2. **Default Selection**: Automatically selects Ethiopia (+251) as the default country
3. **User Input**: User can:
   - Click the country selector to choose a different country
   - Search for countries by name or dial code
   - Enter their phone number
4. **Output**: The `onChange` callback receives the full number: `"+251 912345678"`

## Fallback

If the REST Countries API fails, the component falls back to these countries:
- 🇪🇹 Ethiopia (+251)
- 🇺🇸 United States (+1)
- 🇬🇧 United Kingdom (+44)
- 🇰🇪 Kenya (+254)
- 🇸🇴 Somalia (+252)

## Styling

The component uses inline styles for maximum compatibility. You can customize it by:

1. **Container styling**: Pass `style` or `className` props
2. **CSS Variables**: The component respects `--accent-primary` for focus states
3. **Override styles**: Use more specific CSS selectors if needed

## Examples in the Project

The PhoneInput component is used in:

- ✅ **RegisterForm** (`/components/home/forms/RegisterForm.jsx`)
- ✅ **AddUserModal** (`/components/admin/AddUserModal.jsx`)
- ✅ **GuideProfile** (`/components/guide/GuideProfile.jsx`)
- ✅ **RequestGuide** (`/components/visitor/RequestGuide.jsx`)

## API Reference

### REST Countries API
- Endpoint: `https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags`
- Returns: Country name, code, dial code, and flag image
- No authentication required
- Free to use

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Notes

- Phone numbers are validated client-side only
- The component doesn't enforce specific phone number formats per country
- Full number format: `"{dialCode} {phoneNumber}"` (e.g., "+251 912345678")
- The component is fully controlled - you manage the state

## Future Enhancements

Potential improvements:
- [ ] Phone number format validation per country
- [ ] Auto-detect country from user's location
- [ ] Recent countries list
- [ ] Keyboard navigation improvements
- [ ] Custom flag rendering options
