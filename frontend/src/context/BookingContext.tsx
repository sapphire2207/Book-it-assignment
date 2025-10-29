import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";

interface Slot {
  date: string;
  time: string;
  isBooked: boolean;
  capacity: number;
  bookedCount: number;
}

interface Experience {
  _id: string;
  title: string;
  location: string;
  description: string;
  price: number;
  image: string;
  slots: Slot[];
}

interface BookingDetails {
  experience: string;
  date: string;
  time: string;
  quantity: number;
  subtotal: number;
  taxes: number;
  total: number;
}

interface BookingContextType {
  experiences: Experience[];
  selectedExperience: Experience | null;
  setSelectedExperience: (exp: Experience | null) => void;

  bookingDetails: BookingDetails;
  setBookingDetails: React.Dispatch<React.SetStateAction<BookingDetails>>;

  userInfo: {
    fullName: string;
    email: string;
    promoCode: string;
    agreedToTerms: boolean;
  };
  setUserInfo: React.Dispatch<
    React.SetStateAction<{
      fullName: string;
      email: string;
      promoCode: string;
      agreedToTerms: boolean;
    }>
  >;

  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;

  loading: boolean;
  error: string | null;

  refreshExperiences: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    experience: "",
    date: "",
    time: "",
    quantity: 1,
    subtotal: 0,
    taxes: 0,
    total: 0,
  });

  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    promoCode: "",
    agreedToTerms: false,
  });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/experiences`
      );
      setExperiences(response.data);

      if (selectedExperience) {
        const updated = response.data.find((exp: Experience) => exp._id === selectedExperience._id);
        if (updated) setSelectedExperience(updated);
      }
    } catch (err: any) {
      console.error("Error fetching experiences:", err);
      setError("Failed to load experiences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  return (
    <BookingContext.Provider
      value={{
        experiences,
        selectedExperience,
        setSelectedExperience,
        bookingDetails,
        setBookingDetails,
        userInfo,
        setUserInfo,
        searchTerm,
        setSearchTerm,
        loading,
        error,
        refreshExperiences: fetchExperiences,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBooking must be used within BookingProvider");
  return context;
};