import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import avatar from "../assets/images/avatar.jpg";
import {
  FaPeopleGroup,
  FaLocationDot,
  FaStar,
  FaMapPin,
  FaCity,
  FaDollarSign,
} from "react-icons/fa6";
import CalculateAvg from "../utils/CalculateAvg";
import Booking from "../components/Booking/Booking";
import { toast } from "react-toastify";
import useFetch from "../hooks/useFetch";
import BASE_URL from "../utils/config";
import { AuthContext } from "../context/AuthContext";

const TourDetails = () => {
  const { user } = useContext(AuthContext);
  const reviewMsgRef = useRef();
  const [tourRating, setTourRating] = useState(0);
  const { id } = useParams();

  const { apiData: tour, error, isLoading } = useFetch(
    `${BASE_URL}/tour/${id}`,
    {
      method: "GET",
    }
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const {
    title = "",
    photo = "",
    desc = "",
    price = "",
    reviews = [],
    city = "",
    distance = "",
    maxGroupSize = "",
    address = "",
    schedule = [],
    includedInPackage = "",
    excludedInPackage = "",
    importantInfo = "",
  } = tour || {};

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const reviewsArray = Array.isArray(reviews) ? reviews : [];
  const { totalRating, avgRating } = CalculateAvg(reviewsArray);
  const dateOptions = { day: "numeric", month: "long", year: "numeric" };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const reviewText = reviewMsgRef.current.value;

    if (!user) {
      toast.error("Please Sign In first");
      return;
    }

    const reviewData = {
      username: user.username,
      reviewText,
      rating: tourRating,
    };

    try {
      const response = await fetch(`${BASE_URL}/review/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Review submitted successfully!");
        // Update the reviews without reloading the page
        reviews.push(result.review);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Server not responding");
      console.error(err);
    }
  };

  return (
    <section className="my-4 px-12 w-full">
      <div>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column */}
          <div className="">
            {/* Tour Image */}
            <div className="max-w-3xl max-h-[400px] rounded-md overflow-hidden">
              <img src={photo || avatar} alt={title} />
            </div>

            {/* Tour Details */}
            <div className="my-8 w-12/12 border-4 border-gray-200 shadow-sm rounded-md px-2 py-2 md:px-8 md:py-8 space-y-4">
              <h2 className="text-[25px] md:text-[40px] font-bold mb-4 text-center md:text-start text-BaseColor">
                {title}
              </h2>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
                {/* <div className="flex items-center gap-2">
                  <FaStar />
                  <span>
                    {avgRating} ({reviewsArray.length})
                  </span>
                </div> */}
                <div className="flex items-center gap-2">
                  
                  <span>Days: {address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Tour Dates:- {distance}</span>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
                <div className="flex items-center gap-2">
                  <FaCity />
                  <span>{city}</span>
                </div>
              
                <div className="flex items-center gap-2">
                  <span>Rs. {price}/per head</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPeopleGroup />
                  <span>{maxGroupSize}</span>
                </div>
              </div>
              
                {/* Included Section */}
                
             
              <div className="mt-8">
                <h3 className="text-[25px] md:text-[35px] font-bold">
                  Tour Schedule
                </h3>
                <table className="min-w-half table-auto mt-4  border-separate border-spacing-2">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Day
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Description
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Location
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="px-4 py-2 border border-gray-300">
                          {item.day}
                        </td>
                        <td className="px-4 py-2 w-11/12 border border-gray-300">
                          {item.description}
                        </td>
                        <td className="px-4 py-2 border border-gray-300">
                          {item.location}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 w-10/12">
                  <h3 className="text-[25px] md:text-[35px] font-bold">
                    Included
                  </h3>
                  <p className="">{includedInPackage}</p>
                </div>

                {/* Excluded Section */}
                <div className="mt-8 w-10/12">
                  <h3 className="text-[25px] md:text-[35px] font-bold">
                    Excluded
                  </h3>
                  <p className="">{excludedInPackage}</p>
                </div>

                {/* Information Section */}
                <div className="mt-8 w-10/12">
                  <h3 className="text-[25px] md:text-[35px] font-bold">
                    Information
                  </h3>
                  <p className="">{importantInfo}</p>
                </div>

              
              
            </div>
          </div>

          {/* Booking Section */}
          <div className="w-full px-6 rounded-md">
            <Booking
              title={title}
              price={price}
              avgRating={avgRating}
              reviewsArray={reviewsArray}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourDetails;
