import React, { useEffect } from "react";

const AboutPage = () => {
  useEffect(() => {
    console.log(
      "import.meta.env.VITE_API_ORIGIN",
      import.meta.env.VITE_API_ORIGIN,
    );
  }, []);

  return (
    <div>
      <>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-2">About SportsNet</h1>
          <p className="text-gray-600">
            SportsNet is a platform for athletes to build a sports profile,
            track performance stats, and connect with teams and clubs.
          </p>
        </div>
      </>
    </div>
  );
};

export default AboutPage;
