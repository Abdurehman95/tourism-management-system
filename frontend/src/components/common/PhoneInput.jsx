import React, { useState, useEffect, useRef } from 'react';

/**
 * PhoneInput Component with Country Code Selector
 * Combined in one row with unified border
 */
const PhoneInput = ({
  value = '',
  onChange,
  placeholder = 'Phone Number',
  required = false,
  disabled = false,
  className = '',
  style = {}
}) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  // Fetch countries from REST Countries API
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags')
      .then(res => res.json())
      .then(data => {
        const formattedCountries = data
          .filter(country => country.idd && country.idd.root)
          .map(country => ({
            name: country.name.common,
            code: country.cca2,
            dialCode: country.idd.root + (country.idd.suffixes?.[0] || ''),
            flag: country.flags.svg || country.flags.png
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(formattedCountries);
        const ethiopia = formattedCountries.find(c => c.code === 'ET');
        setSelectedCountry(ethiopia || formattedCountries[0]);
      })
      .catch(err => {
        console.error('Error fetching countries:', err);
        const fallbackCountries = [
          { name: 'Ethiopia', code: 'ET', dialCode: '+251', flag: '🇪🇹' },
          { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸' },
          { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧' },
          { name: 'Kenya', code: 'KE', dialCode: '+254', flag: '🇰🇪' }
        ];
        setCountries(fallbackCountries);
        setSelectedCountry(fallbackCountries[0]);
      });
  }, []);

  useEffect(() => {
    if (value && selectedCountry) {
      if (value.startsWith(selectedCountry.dialCode)) {
        setPhoneNumber(value.substring(selectedCountry.dialCode.length).trim());
      } else {
        setPhoneNumber(value);
      }
    }
  }, [value, selectedCountry]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePhoneChange = (e) => {
    const number = e.target.value.replace(/[^\d\s\-()]/g, '');
    setPhoneNumber(number);
    if (onChange && selectedCountry) {
      onChange(number ? `${selectedCountry.dialCode} ${number}` : '');
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchTerm('');
    if (onChange && phoneNumber) {
      onChange(`${country.dialCode} ${phoneNumber}`);
    }
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dialCode.includes(searchTerm)
  );

  return (
    <div style={{ position: 'relative', width: '100%', ...style }} className={className}>
      {/* Combined Input Container */}
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          alignItems: 'stretch',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          backgroundColor: disabled ? '#f9fafb' : '#fff',
          transition: 'border-color 0.2s ease',
          height: '48px'
        }}
      >
        {/* Country Code Selector Button */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
            disabled={disabled}
            onFocus={() => containerRef.current && (containerRef.current.style.borderColor = '#3b82f6')}
            onBlur={() => containerRef.current && (containerRef.current.style.borderColor = '#d1d5db')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 16px',
              border: 'none',
              borderRight: '1px solid #e5e7eb',
              background: 'transparent',
              cursor: disabled ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 500,
              color: '#1f2937',
              transition: 'background 0.2s ease',
              height: '100%',
              minWidth: '120px'
            }}
            onMouseEnter={(e) => !disabled && (e.currentTarget.style.background = '#f9fafb')}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            {selectedCountry ? (
              <>
                {selectedCountry.flag.startsWith('http') ? (
                  <img
                    src={selectedCountry.flag}
                    alt={selectedCountry.name}
                    style={{
                      width: '24px',
                      height: '18px',
                      objectFit: 'cover',
                      borderRadius: '3px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '20px' }}>{selectedCountry.flag}</span>
                )}
                <span style={{ fontWeight: 600 }}>{selectedCountry.dialCode}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path d="M2 4L6 8L10 4" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </>
            ) : (
              <span>Loading...</span>
            )}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
              zIndex: 1000,
              minWidth: '320px',
              maxHeight: '400px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Search Input */}
              <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ position: 'relative' }}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none'
                    }}
                  >
                    <circle cx="8" cy="8" r="6" stroke="#9ca3af" strokeWidth="2" />
                    <path d="M12 12L16 16" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 40px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
              </div>

              {/* Country List */}
              <div style={{
                overflowY: 'auto',
                maxHeight: '320px',
                padding: '8px'
              }}>
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        border: 'none',
                        background: selectedCountry?.code === country.code ? '#eff6ff' : 'transparent',
                        cursor: 'pointer',
                        fontSize: '14px',
                        textAlign: 'left',
                        borderRadius: '8px',
                        transition: 'background 0.15s ease',
                        marginBottom: '2px'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedCountry?.code !== country.code) {
                          e.currentTarget.style.background = '#f9fafb';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = selectedCountry?.code === country.code ? '#eff6ff' : 'transparent';
                      }}
                    >
                      {country.flag.startsWith('http') ? (
                        <img
                          src={country.flag}
                          alt={country.name}
                          style={{
                            width: '24px',
                            height: '18px',
                            objectFit: 'cover',
                            borderRadius: '3px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '22px' }}>{country.flag}</span>
                      )}
                      <span style={{ flex: 1, color: '#1f2937', fontWeight: 500 }}>
                        {country.name}
                      </span>
                      <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>
                        {country.dialCode}
                      </span>
                    </button>
                  ))
                ) : (
                  <div style={{
                    padding: '32px 20px',
                    textAlign: 'center',
                    color: '#9ca3af',
                    fontSize: '14px'
                  }}>
                    No countries found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onFocus={() => containerRef.current && (containerRef.current.style.borderColor = '#3b82f6')}
          onBlur={() => containerRef.current && (containerRef.current.style.borderColor = '#d1d5db')}
          style={{
            flex: 1,
            padding: '0 18px',
            border: 'none',
            outline: 'none',
            fontSize: '16px',
            backgroundColor: 'transparent',
            color: '#1f2937'
          }}
        />
      </div>
    </div>
  );
};

export default PhoneInput;
