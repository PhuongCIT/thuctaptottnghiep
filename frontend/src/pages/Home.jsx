import React, { useContext } from "react";
import TopServices from "../components/TopServices";
import Banner from "../components/Banner";
import TopReviews from "../components/TopReviews";
import { AppContext } from "../context/AppContext";
import Staff from "../components/Staff";

const Home = () => {
  const { staffs, reviews } = useContext(AppContext);
  return (
    <div className="">
      <Banner />

      <TopServices />
      <TopReviews reviews={reviews} />
      <Staff staffs={staffs} />
    </div>
  );
};

export default Home;
