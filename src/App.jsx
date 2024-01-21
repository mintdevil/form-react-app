import { useState, useEffect, useRef } from 'react';
import { Table, Button, Label, TextInput, Select } from 'flowbite-react'
import { MoonIcon, SunIcon, PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/24/outline';
import { TECollapse } from "tw-elements-react";
import exampleData from './data.json';
import './index.css';
import axios from 'axios';

const App = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [formOpen, setFormOpen] = useState(false);
  const [tableData, setTableData] = useState(exampleData);

  const [countries, setCountries] = useState([]);
  const [userAddress, setUserAddress] = useState('');
  const [userNationality, setUserNationality] = useState('');
  const [userPhoneCode, setUserPhoneCode] = useState('');

  const formRef = useRef(null);

  // For dark mode
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // Opens form when user clicks on "Add Item" button
  // Closes form when user clicks on "Close" button
  const toggleForm = () => {
    setFormOpen((prevFormOpen) => !prevFormOpen);
  };

  // For location API
  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          reverseGeocode(latitude, longitude);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported in this browser.');
    }
  }

  // gets user's address from latitude and longitude using geoapify API
  const reverseGeocode = async (latitude, longitude) => {
    const apiKey = import.meta.env.VITE_LOCATION_API_KEY;
    const apiUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.features[0]) {
        setUserAddress(data.features[0].properties.formatted);
        setUserNationality(data.features[0].properties.country);
        setUserPhoneCode(countries.find(country => country.name === data.features[0].properties.country).code);
      } else {
        console.error('No address found for the provided coordinates.');
      }
    } catch (error) {
      console.error('Error fetching reverse geocoding data:', error);
    }
  };

  // Fetch country information (name and phone code) from REST Countries API
  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all?fields=name,idd')
      .then(response => {
        const countriesData = response.data.flatMap(country => {
          const root = country.idd.root || '';
          const suffixes = country.idd.suffixes || [];

          // If no country code availble, only return country name
          if (root == '' && suffixes.length == 0) {
            return [{ name: country.name.common, code: '' }];
          }

          // Else, return country name and all possible country codes
          return suffixes.map(suffix => ({
            name: country.name.common,
            code: `${root}${suffix}`,
          }));
        });

        setCountries(countriesData);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  }, []);

  // Refs for inputs that can change with location API
  const addressRef = useRef(null);
  const countryRef = useRef(null);
  const codeRef = useRef(null);

  // Changing inputs when location API is called
  useEffect(() => {
    if (userAddress) {
      addressRef.current.value = userAddress;
    }
  });

  useEffect(() => {
    if (userNationality) {
      // Check if country exists in the list of countries
      const selectedCountry = countries.find(country => country.name === userNationality);
      if (selectedCountry) {
        countryRef.current.value = selectedCountry.name;
      }
    }
  }, [countries, userNationality]);

  useEffect(() => {
    if (userPhoneCode) {
      // Check if country exists in the list of countries
      const selectedCountry = countries.find(country => country.code === userPhoneCode);
      if (selectedCountry) {
        codeRef.current.value = selectedCountry.code;
      }
    }
  }, [countries, userPhoneCode]);

  // Function called when user submits form
  const handleSubmit = (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.target);
  
    const name = formData.get('name');
    const address = formData.get('address');
    const email = formData.get('email');
    const phoneCode = formData.get('phoneCode');
    const phone = formData.get('phone');
    const dateOfBirth = formData.get('dateOfBirth');
    const nationality = formData.get('nationality');
    const gender = formData.get('gender');

    const newData = {
      'name': name,
      'address': address,
      'email': email,
      'phoneCode': phoneCode,
      'phone': phone,
      'dateOfBirth': dateOfBirth,
      'nationality': nationality,
      'gender': gender
    }

    // Append new data to table
    setTableData([...tableData, newData]);

    // Reset form
    setFormOpen(false);
    formRef.current.reset();
    setUserAddress('');
    setUserNationality('');
    setUserPhoneCode('');
  };

  const renderForm = () => {
    return (
      <TECollapse className="mb-4 bg-gray-100 dark:bg-gray-900 p-5 rounded-md max-w-md shadow-none" show={formOpen}>
        <form ref={formRef} onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Name" />
            </div>
            <TextInput id="name" name="name" type="text" required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="address" value="Address" />
            </div>
            <div className="flex w-full">
              <TextInput className="w-4/5" id="address" name="address" type="text" ref={addressRef} required />
              <Button className="ml-2 w-1/5" onClick={getLocation}>Get</Button>
            </div>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Email" />
            </div>
            <TextInput id="email" name="email" type="email" required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="phone" value="Phone Number" />
            </div>
            <div className="flex w-full">
              <Select className="w-2/5 form-input" id="phoneCode" name="phoneCode" ref={codeRef} required>
                {/* Filter out duplicate country codes and sort */}
                {countries
                  .filter((country, index, self) => country.code !== '' && index === self.findIndex(c => c.code === country.code))
                  .sort((a, b) => a.code.localeCompare(b.code))
                  .map((country, index) => (
                    <option key={index} value={country.code}>{country.code}</option>
                  ))}
              </Select>
              <TextInput className="ml-2 w-3/5" id="phone" name="phone" type="number" required />
            </div>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="dateOfBirth" value="Date of Birth" />
            </div>
            {/* Disable selection of future dates */}
            <TextInput id="dateOfBirth" name="dateOfBirth" type="date" max={new Date().toISOString().split('T')[0]} required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="nationality" value="Nationality" />
            </div>
            <Select id="nationality" name="nationality" className="form-input" ref={countryRef} required>
              {/* Filter out duplicate countries and sort alphabetically*/}
              {countries
                .filter((country, index, self) => {
                  return index === self.findIndex(c => c.name === country.name);
                })
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((country, index) => (
                  <option key={index} value={country.name}>
                    {country.name}
                  </option>
                ))
              }
            </Select>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="gender" value="Gender" />
            </div>
            <Select id="gender" name="gender" className="form-input" required>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </TECollapse>
    );
  }

  const renderTable = () => {
    return (
      <div className="overflow-x-auto">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Address</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Phone Number</Table.HeadCell>
            <Table.HeadCell>Date of Birth</Table.HeadCell>
            <Table.HeadCell>Nationality</Table.HeadCell>
            <Table.HeadCell>Gender</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {tableData.map((user, index) => (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={index}>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.address}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.phoneCode} {user.phone}</Table.Cell>
                <Table.Cell>{user.dateOfBirth}</Table.Cell>
                <Table.Cell>{user.nationality}</Table.Cell>
                <Table.Cell>{user.gender}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-5 dark:bg-gray-800 flex flex-col">
      <div className="flex items-center mb-4">
        <button
          onClick={toggleForm}
          className="flex items-center p-2"
        >
          {formOpen ? <MinusCircleIcon className="dark:text-gray-400 h-6 w-6" /> : <PlusCircleIcon className="dark:text-gray-400 h-6 w-6" />}
          <p className="dark:text-gray-400 ml-2">{formOpen ? "Close" : "Add Item"}</p>
        </button>
        <button
          onClick={toggleDarkMode}
          className="p-2 self-end ml-auto"
        >
          {darkMode ? <SunIcon className="text-gray-400 h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
        </button>
      </div>
      {renderForm()}
      {renderTable()}
    </div>
  );
};

export default App;
