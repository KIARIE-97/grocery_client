import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, MapPin, ChevronDown, Check } from 'lucide-react';
import { useForm } from '@tanstack/react-form';

interface Suggestion {
  label: string;
  value: string;
  context?: {
    country?: { name: string; country_code: string };
    region?: { name: string };
    county?: { name: string };
    locality?: { name: string };
    postcode?: { name: string };
  };
}

export const EnhancedLocationForm = ({ 
  onSuccess, 
  onCancel 
}: {
  onSuccess?: () => void;
  onCancel?: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [countrySuggestions, setCountrySuggestions] = useState<Suggestion[]>([]);
  const [regionSuggestions, setRegionSuggestions] = useState<Suggestion[]>([]);
  const [addressSuggestions, setAddressSuggestions] = useState<Suggestion[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('');

  const form = useForm({
    defaultValues: {
      label: '',
      country: '',
      region: '',
      county: '',
      addressLine1: '',
      city: '',
      postalCode: '',
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted with values:', value);
      onSuccess?.();
    },
  });

  // Fetch countries from OpenRouteService
const fetchCountries = async (query: string) => {
  if (query.length < 2) return

  setIsLoading(true)
  try {
    const response = await fetch(
      `https://api.openrouteservice.org/geocode/autocomplete?api_key=${import.meta.env.VITE_OPENROUTE_API_KEY}&text=${encodeURIComponent(query)}&layers=country`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    )

    // Check if response is OK (status 200-299)
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API Error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    setCountrySuggestions(
      data.features?.map((feature: any) => ({
        label: feature.properties.label,
        value: feature.properties.country_code,
        context: feature.properties.context,
      })) || [],
    )
  } catch (error) {
    console.error('Error fetching countries:', error)
    // Show user-friendly error message
    alert('Failed to load countries. Please try again later.')
  } finally {
    setIsLoading(false)
  }
}

  // Fetch regions from OpenRouteService
  const fetchRegions = async (countryCode: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.openrouteservice.org/geocode/autocomplete?api_key=${import.meta.env.VITE_OPENROUTE_API_KEY}&boundary.country=${countryCode}&layers=region`
      );
      const data = await response.json();
      setRegionSuggestions(data.features?.map((feature: any) => ({
        label: feature.properties.label,
        value: feature.properties.region,
        context: feature.properties.context
      })) || []);
    } catch (error) {
      console.error('Error fetching regions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch address suggestions from OpenRouteService
  const fetchAddressSuggestions = async (query: string) => {
    if (query.length < 3 || !selectedCountryCode) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.openrouteservice.org/geocode/autocomplete?api_key=${import.meta.env.VITE_OPENROUTE_API_KEY}&text=${query}&boundary.country=${selectedCountryCode}`
      );
      const data = await response.json();
      setAddressSuggestions(data.features?.map((feature: any) => ({
        label: feature.properties.label,
        value: feature.properties.label,
        context: feature.properties.context
      })) || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fill fields when address is selected
  const handleAddressSelect = (suggestion: Suggestion) => {
    form.setFieldValue('addressLine1', suggestion.label);
    
    if (suggestion.context) {
      form.setFieldValue('country', suggestion.context.country?.name || '');
      form.setFieldValue('region', suggestion.context.region?.name || '');
      form.setFieldValue('city', suggestion.context.locality?.name || '');
      form.setFieldValue('postalCode', suggestion.context.postcode?.name || '');
    }
    setAddressSuggestions([]);
  };

  useEffect(() => {
    if (selectedCountryCode) {
      fetchRegions(selectedCountryCode);
      form.setFieldValue('region', '');
    }
  }, [selectedCountryCode]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-100"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <MapPin className="text-blue-500" size={20} />
        Add New Delivery Address
      </h2>

      <form.Field name="label">
        {(field) => (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Label (e.g., Home, Work)
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="My Home"
            />
          </div>
        )}
      </form.Field>

      {/* Country Field with OpenRouteService integration */}
      <form.Field name="country">
        {(field) => (
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <div className="relative">
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={field.state.value}
                onChange={(e) => {
                  field.handleChange(e.target.value);
                  fetchCountries(e.target.value);
                }}
                placeholder="Start typing a country..."
              />
              {isLoading && (
                <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-gray-400" />
              )}
            </div>
            <AnimatePresence>
              {countrySuggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border border-gray-200 max-h-60 overflow-auto"
                >
                  {countrySuggestions.map((suggestion) => (
                    <motion.li
                      key={suggestion.value}
                      whileHover={{ backgroundColor: '#f3f4f6' }}
                      className="px-3 py-2 cursor-pointer flex items-center justify-between"
                      onClick={() => {
                        field.handleChange(suggestion.label);
                        setSelectedCountryCode(suggestion.value);
                        setCountrySuggestions([]);
                      }}
                    >
                      <span>{suggestion.label}</span>
                      {field.state.value === suggestion.label && (
                        <Check className="h-4 w-4 text-blue-500" />
                      )}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        )}
      </form.Field>

      {/* Region/State Field */}
      <AnimatePresence>
        {selectedCountryCode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <form.Field name="region">
              {(field) => (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Region/State
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={regionSuggestions.length === 0}
                    >
                      <option value="">Select region</option>
                      {regionSuggestions.map((region) => (
                        <option key={region.value} value={region.label}>
                          {region.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              )}
            </form.Field>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address Field with OpenRouteService integration */}
      <AnimatePresence>
        {selectedCountryCode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <form.Field name="addressLine1">
              {(field) => (
                <div className="mb-4 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <div className="relative">
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={field.state.value}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        fetchAddressSuggestions(e.target.value);
                      }}
                      placeholder="Start typing your address..."
                    />
                    {isLoading && (
                      <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-gray-400" />
                    )}
                  </div>
                  <AnimatePresence>
                    {addressSuggestions.length > 0 && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border border-gray-200 max-h-60 overflow-auto"
                      >
                        {addressSuggestions.map((suggestion) => (
                          <motion.li
                            key={suggestion.value}
                            whileHover={{ backgroundColor: '#f3f4f6' }}
                            className="px-3 py-2 cursor-pointer"
                            onClick={() => handleAddressSelect(suggestion)}
                          >
                            {suggestion.label}
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </form.Field>
          </motion.div>
        )}
      </AnimatePresence>

      {/* City and Postal Code Fields */}
      <AnimatePresence>
        {form.getFieldValue('addressLine1') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 gap-4"
          >
            <form.Field name="city">
              {(field) => (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="postalCode">
              {(field) => (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </span>
          ) : (
            'Save Address'
          )}
        </button>
      </div>
    </motion.div>
  );
};