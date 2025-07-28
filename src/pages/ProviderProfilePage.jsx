import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import ProviderProfileHeader from "../components/ui/ProviderProfileHeader";
import ProviderProfileDetails from "../components/ui/ProviderProfileDetails";
import { Star } from "lucide-react";
import { toast } from "react-toastify";

function ProviderProfilePage() {
  const { id } = useParams();
  const [providerData, setProviderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerReviews, setCustomerReviews] = useState([]);

  useEffect(() => {
    const fetchProviderDetailsAndReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch provider details
        const providerResponse = await fetch(`http://localhost:8081/api/public/provider/${id}`);
        const providerData = await providerResponse.json();

        if (!providerResponse.ok) {
          throw new Error(providerData.error || "Failed to fetch provider details.");
        }

        setProviderData(providerData);
        console.log("Fetched provider details:", providerData);

        // Fetch customer reviews for the provider
        const reviewsResponse = await fetch(`http://localhost:8081/api/public/provider/${id}/ratings`);
        const reviewsData = await reviewsResponse.json();

        if (!reviewsResponse.ok) {
          if (reviewsResponse.status === 404) {
            console.warn("No reviews found for this provider or reviews endpoint not found.");
            setCustomerReviews([]);
          } else {
            throw new Error(reviewsData.error || "Failed to fetch customer reviews.");
          }
        } else {
            const formattedReviews = reviewsData.map(review => ({
                ...review,
                rating: review.score
            }));
            setCustomerReviews(formattedReviews);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Could not load provider profile or reviews. Please try again.");
        setProviderData(null);
        setCustomerReviews([]);
        toast.error("Failed to load provider profile.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProviderDetailsAndReviews();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        <p className="ml-4 text-lg text-gray-700">Loading provider profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-20 text-xl text-red-500">
          {error}
        </div>
      </>
    );
  }

  if (!providerData) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-20 text-xl text-red-500">
          Provider not found.
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-indigo-100 via-white to-purple-100 min-h-screen
pb-20">
        <ProviderProfileHeader provider={providerData} />
        <ProviderProfileDetails provider={providerData} />

        <section className="max-w-6xl mx-auto px-6 py-12 mt-12">
          <h2 className="text-4xl font-bold text-center text-indigo-800 mb-6">
            Customer Reviews
          </h2>

          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-5 py-2
rounded-full font-semibold text-lg shadow-sm">
              <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
              {providerData.averageRating?.toFixed(1) || 'N/A'} ({customerReviews.length} reviews)
            </div>
          </div>

          {customerReviews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {customerReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-3"> {/* Added mb-3 for spacing below avatar/name */}
                      <div className="bg-indigo-100 text-indigo-700 rounded-full w-12 h-12 flex items-
center justify-center font-bold text-xl flex-shrink-0">
                        {review.customerName?.charAt(0) || '?'}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {review.customerName}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: review.score }, (_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-400"
                              fill="currentColor"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Adjusted text styling for better readability */}
                    <p className="text-gray-700 text-base leading-normal italic">
                      "{review.comment}"
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mt-4 text-right">
                    {new Date(review.createdAt).toLocaleDateString('en-GB')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-8">
              No reviews available yet for this provider.
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default ProviderProfilePage;