import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../../utils/config";
import { AuthContext } from "../../context/AuthContext";


const CreateTours = () => {
  const { token } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    city: "",
    desc: "",
    address: "",
    price: 0,
    maxGroupSize: 1,
    photo: "",
    distance: 0,
    featured: false,
    schedule: [{ day: "", description: "", location: "" }],
    includedInPackage: "",
    excludedInPackage: "",
    importantInfo: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };



  const handleTableChange = (index, field, value) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[index][field] = value;
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const addRow = () => {
    setFormData({
      ...formData,
      schedule: [
        ...formData.schedule,
        { day: "", description: "", location: "" },
      ],
    });
  };

  const removeRow = (index) => {
    const updatedSchedule = formData.schedule.filter((_, i) => i !== index);
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/tour`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const { message } = await response.json();

      if (response.ok) {
        toast.success("Tour created successfully!");
        setFormData({
          title: "",
          city: "",
          desc: "",
          address: "",
          price: 0,
          maxGroupSize: 1,
          photo: "",
          distance: 0,
          featured: false,
          schedule: [{ day: "", description: "", location: "" }],
          includedInPackage: "",
          excludedInPackage: "",
          importantInfo: "",
        }); // Reset form
      } else {
        toast.error(message || "Failed to create tour.");
      }
    } catch (err) {
      toast.error("Server not responding");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen md:min-h-[400px] flex items-center justify-center bg-gray-100">
      <div className="bg-white mx-6 p-6 md:p-8 rounded-lg text-center shadow-md w-full max-w-2xl m-8 md:max-w-[90%]">
        <div className="flex flex-col justify-center">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Create Tour
            </h2>
            <p className="text-sm md:text-base text-GrayColor">
              Add a new tour by filling in the fields below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2 md:space-y-3">
            <div className="md:grid grid-cols-2 gap-8">
              <div>
                <label className="block text-md md:text-lg font-medium text-GrayColor">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter Tour Name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-GreenColor"
                  value={formData.title}
                  onChange={handleInput}
                  required
                />
              </div>

              <div>
                <label className="block text-md md:text-lg font-medium text-GrayColor">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="Enter City Name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-GreenColor"
                  value={formData.city}
                  onChange={handleInput}
                  required
                />
              </div>
            </div>

            <div className="md:grid grid-cols-3 gap-8">
              <div>
                <label className="block text-md md:text-lg font-medium text-GrayColor">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  placeholder="Enter Price"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-GreenColor"
                  value={formData.price}
                  onChange={handleInput}
                  required
                />
              </div>

              <div>
                <label className="block text-md md:text-lg font-medium text-GrayColor">
                  Max Peoples
                </label>
                <input
                  type="number"
                  name="maxGroupSize"
                  placeholder="Enter Max Peoples per Trip Tour"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-GreenColor"
                  value={formData.maxGroupSize}
                  onChange={handleInput}
                  required
                />
              </div>

              <div>
                <label className="block text-md md:text-lg font-medium text-GrayColor">
                  Tour Schedule
                </label>
                <input
                  type="Text"
                  name="distance"
                  placeholder="Enter Tour schedule(23/11/2024 - 02/12/2024)"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-GreenColor"
                  value={formData.distance}
                  onChange={handleInput}
                />
              </div>
            </div>

            <div>
              <label className="block text-md md:text-lg font-medium text-GrayColor">
                Tour Days
              </label>
              <input
                type="text"
                name="address"
                placeholder="Enter Days and nights (14days and 13 nights)"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-GreenColor"
                value={formData.address}
                onChange={handleInput}
                required
              />
            </div>

            <div>
              <label className="block text-md md:text-lg font-medium text-GrayColor mb-2">
                Schedule
              </label>
              <table className="w-full border-collapse border border-gray-300 text-left text-sm md:text-base">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Day No</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Description
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Night Stay Location
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formData.schedule.map((day, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="number"
                          className="w-full px-2 py-1 border rounded"
                          placeholder="Day"
                          value={day.day}
                          onChange={(e) =>
                            handleTableChange(index, "day", e.target.value)
                          }
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          className="w-full px-2 py-1 border rounded"
                          placeholder="Description"
                          value={day.description}
                          onChange={(e) =>
                            handleTableChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          className="w-full px-2 py-1 border rounded"
                          placeholder="Night Stay Location"
                          value={day.location}
                          onChange={(e) =>
                            handleTableChange(index, "location", e.target.value)
                          }
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <button
                          type="button"
                          className="text-red-500 hover:underline"
                          onClick={() => removeRow(index)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                onClick={addRow}
                className="mt-4 text-white bg-green-500 px-4 py-2 rounded-md"
              >
                Add New Day
              </button>
            </div>
            <div>
              <div className="mb-4">
                <label className="block text-md md:text-lg font-medium text-gray-800">
                  Included in Package
                </label>
                <textarea
                  name="includedInPackage"
                  className="w-full border px-4 py-2 rounded-md"
                  value={formData.includedInPackage}
                  onChange={handleInput}
                  rows="4"
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-md md:text-lg font-medium text-gray-800">
                Excluded in Package
                </label>
                <textarea
                  name="excludedInPackage"
                  className="w-full border px-4 py-2 rounded-md"
                  value={formData.excludedInPackage}
                  onChange={handleInput}
                  rows="4"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-md md:text-lg font-medium text-gray-800">
                Important Information
                </label>
                <textarea
                  name="importantInfo"
                  className="w-full border px-4 py-2 rounded-md"
                  value={formData.importantInfo}
                  onChange={handleInput}
                  rows="4"
                ></textarea>
              </div>
            </div>
            <div>
              <label
                htmlFor=""
                className="block text-md md:text-lg font-medium text-GrayColor"
              >
                Photo URL
              </label>
              <input
                type="text"
                name="photo"
                placeholder="Enter Picture URL"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-GreenColor"
                value={formData.photo}
                onChange={handleInput}
                required
              />
            </div>

            <div className="flex items-center justify-between mb-3">
              <label
                htmlFor=""
                className="text-TextColor text-[15px] font-semibold leading-7 px-4"
              >
                Featured
                <select
                  name="featured"
                  value={formData.featured}
                  onChange={handleInput}
                  className="text-TextColor text-[15px] leading-7 px-4 py-3 focus:outline-none"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </label>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-md"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Tour"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTours;
