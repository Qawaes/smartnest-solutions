import { useNavigate } from "react-router-dom";

export default function BackToHome() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-4"
    >
      ← Back to Home
    </button>
  );
}
