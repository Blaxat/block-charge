'use client';
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { cn } from '@/utils/cn';

interface QueueItem {
  _id: string;
  email: string;
  vehicleType: string;
}

export default function UpdateStationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    queue: '',
  });

  const [stationData, setStationData] = useState<any>(null); // Adjust type as per your API response structure
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );

  useEffect(() => {
    fetchStationData();
  }, []); // Fetch data on component mount

  const fetchStationData = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/validate-token',
        { token }
      );
      if (response.data.valid) {
        setStationData(response.data.user);
      } else {
        console.error('Invalid token');
      }
    } catch (error) {
      console.error('Error fetching station data:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      console.log('Authorization token not found. Please log in again.');
      return;
    }

    try {
      // Filter out empty fields and create a payload
      const payload = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== '') {
          payload[key] = formData[key];
        }
      });

      const response = await axios.put(
        `http://localhost:5000/api/stations/${stationData.placeId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Update Successful', response.data);
      // Handle success, e.g., show success message
    } catch (error) {
      console.error('Update Failed', error.response?.data);

      // Handle error, e.g., show error message
    }
  };

  const handleFetchQueueItems = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/stations/${stationData.placeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Queue Items:', response.data.queueItems);
      // Set state or handle the queue items data as needed
    } catch (error) {
      console.error('Error fetching queue items:', error.response?.data);
      // Handle error, e.g., show error message
    }
  };

  const handleDeleteQueueItem = async (email: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/stations/${stationData.placeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            email,
          },
        }
      );
      console.log('Delete Successful', response.data);
      // Handle success, e.g., update UI after deleting the queue item
    } catch (error) {
      console.error('Delete Failed', error.response?.data);
      // Handle error, e.g., show error message
    }
  };

  if (!stationData) return <p>Loading...</p>;

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to dashboard
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Update One or more values
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              placeholder="Tyler"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              placeholder="Durden"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
            />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="projectmayhem@fc.com"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="queue">Queue</Label>
          <Input
            id="queue"
            placeholder="Enter current Queue e.g: 10,15,etc."
            type="text"
            value={formData.queue}
            onChange={handleChange}
          />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Update &rarr;
          <BottomGradient />
        </button>
      </form>

      {/* Button to fetch queue items */}
      <button
        className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        onClick={handleFetchQueueItems}
      >
        Fetch Queue Items
      </button>

      {/* Display queue items */}
      <div className="mt-4">
        <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-200 mb-2">
          Queue Items
        </h3>
        {stationData.queueItems.length === 0 ? (
          <p>No queue items found.</p>
        ) : (
          <ul className="space-y-2">
            {stationData.queueItems.map(
              (
                item: any // Adjust type as per your API response structure
              ) => (
                <li
                  key={item._id}
                  className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-md"
                >
                  <div>
                    <p className="font-medium">{item.email}</p>
                    <p>{item.vehicleType}</p>
                  </div>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
                    onClick={() => handleDeleteQueueItem(item.email)}
                  >
                    Delete
                  </button>
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('flex flex-col space-y-2 w-full', className)}>
      {children}
    </div>
  );
};
