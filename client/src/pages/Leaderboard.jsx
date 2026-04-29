export default function Leaderboard() {
  const teams = [
    { name: "Team Alpha", score: 95 },
    { name: "Team Beta", score: 88 },
    { name: "Team Gamma", score: 80 },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">🏆 Leaderboard</h1>

      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-4">
        {teams.map((team, index) => (
          <div
            key={index}
            className="flex justify-between p-3 border-b last:border-none"
          >
            <span className="font-semibold">
              #{index + 1} {team.name}
            </span>
            <span className="text-blue-600 font-bold">
              {team.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}