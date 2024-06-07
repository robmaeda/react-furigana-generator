import { useState } from "react";
import axios from "axios";

const App = () => {
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const handleButtonClick = async () => {
    if (!inputText.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://flask-furigana-generator.vercel.app/furigana",
        {
          text: inputText,
        }
      );
      setOutputText(response.data.result);
    } catch (error) {
      console.error("Error fetching Furigana:", error);
      setOutputText("Failed to fetch Furigina.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-around p-5">
      <div>
        <textarea
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter Japanese text here"
          className="w-72 h-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleButtonClick}
          disabled={isLoading || !inputText.trim()}
          className={`mt-2 w-full p-2 bg-blue-500 text-white rounded-md ${
            isLoading || !inputText.trim() ? "bg-blue-300" : "hover:bg-blue-700"
          }`}
        >
          Generate Furigana
        </button>
      </div>
      <div className="w-72 h-24 border border-gray-300 p-2 rounded-md">
        {isLoading ? (
          "Loading..."
        ) : (
          <div dangerouslySetInnerHTML={{ __html: outputText }} />
        )}
      </div>
    </div>
  );
};

export default App;
