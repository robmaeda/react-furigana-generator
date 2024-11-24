import axios from "axios";
import parse from "html-react-parser";
import { useState } from "react";

interface OutputText {
  furigana: string;
  hiragana: string;
}

const App = () => {
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<OutputText>({furigana: "", hiragana: ""});
  const [showFurigana, setShowFurigana] = useState(true);
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
      setOutputText({ furigana: "Failed to fetch Furigana. Please try again", hiragana: "" });
    } finally {
      setIsLoading(false);
    }
  };

  const disabled = isLoading || !inputText.trim();

  return (
    <div className="px-10 py-5 flex flex-col items-center xl:pt-14">
      <div className="text-3xl">Furigana Generator</div>
      <div className="mt-2">Input Japanese text to get its furigana instantly with our generator.</div>
      <div className="mt-4">Paste the example below: 仕事を探していますよ。</div>
      <div className="flex flex-col items-center justify-center mt-14">
        <div className="flex">
          <textarea
            value={inputText}
            onChange={handleInputChange}
            placeholder="Enter Japanese text here"
            className="w-96 h-48 p-2 border resize-none border-[#1E1E1E] focus:outline-none focus:ring-2 bg-[#EDE8DF] focus:border-transparent"
          />
          <div className="w-96 h-48 ml-10 border border-[#1E1E1E] bg-[#E6E0D5] p-2">
          {isLoading ? (
            "Loading..."
          ) : (
            <div>{showFurigana ? parse(outputText.furigana) : outputText.hiragana}</div>
          )}
          </div>
        </div>
        {outputText.furigana && <button className="mt-16 w-64 px-4 py-2 bg-[#8C4843] text-white" onClick={() => setShowFurigana((prevState) => !prevState)}>{showFurigana ? "Show hiragana only" : "Show furigana"}</button>}
        <button
            onClick={handleButtonClick}
            disabled={disabled}
            className={`mt-16 w-64 px-4 py-2 bg-[#8C4843] text-white ${
              disabled ? "cursor-not-allowed opacity-60" : ""
            }`}
          >
            Generate
        </button>
      </div>
    </div>
  );
};

export default App;
