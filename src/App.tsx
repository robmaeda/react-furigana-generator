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
      setOutputText("Failed to fetch Furigana.");
    } finally {
      setIsLoading(false);
    }
  };

  const disabled = isLoading || !inputText.trim();

  return (
    <div className="px-10 py-5">
      <div className="text-2xl">Furigana Generator</div>
      <div className="flex mt-4">
        <div className="flex flex-col">
          <textarea
            value={inputText}
            onChange={handleInputChange}
            placeholder="Enter Japanese text here"
            className="w-96 h-36 p-2 border resize-none border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleButtonClick}
            disabled={disabled}
            className={`mt-2 w-48 px-4 py-2 bg-blue-500 text-white rounded-md ${
              disabled ? "!bg-blue-300 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            Generate Furigana
          </button>
        </div>
        <div className="w-96 h-36 ml-10 border border-gray-300 bg-gray-100 p-2 rounded-md">
          {isLoading ? (
            "Loading..."
          ) : (
            <div dangerouslySetInnerHTML={{ __html: outputText }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
