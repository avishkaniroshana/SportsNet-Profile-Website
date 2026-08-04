const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl p-8 border border-gray-200">
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
          About SportsNet
        </span>

        <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-3">
          Connecting Sports & Sports Organizations
        </h1>

        <p className="text-gray-600 leading-relaxed">
          SportsNet is a digital platform designed for players, coaches, and
          sports clubs to build verified athletic profiles, maintain career
          records across multiple sports, and connect with opportunities
          worldwide.
        </p>

        <hr className="my-6 border-gray-100" />

        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h2 className="font-bold text-gray-900 mb-2">Our Mission</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Empower performers across all sports levels to highlight their
              achievements, physical stats, educational background, and team
              histories in one central hub.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-gray-900 mb-2">Key Features</h2>
            <ul className="text-gray-600 text-sm space-y-2 list-disc pl-4">
              <li>Multi-sport profile management</li>
              <li>Scouted player directory with pagination</li>
              <li>Per-sport club, team, & achievement tracking</li>
              <li>Secure JWT authentication & image upload</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
