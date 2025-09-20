import axios from "axios";
import parse from "html-react-parser";
import { useEffect, useState } from "react";

interface OutputText {
  furigana: string;
  hiragana: string;
}

const App = () => {
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<OutputText>({furigana: "", hiragana: ""});
  const [showFurigana, setShowFurigana] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [translateEnabled, setTranslateEnabled] = useState<boolean>(false);
  const [translation, setTranslation] = useState<string>("");
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  // Reset translate toggle on page load
  useEffect(() => {
    setTranslateEnabled(false);
    setTranslation("");
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const handleButtonClick = async () => {
    if (!inputText.trim()) {
      return;
    }

    setIsLoading(true);
    setTranslation(""); // Clear previous translation
    
    try {
      // Generate furigana
      const furiganaResponse = await axios.post(
        "https://flask-furigana-generator.vercel.app/furigana",
        {
          text: inputText,
        }
      );
      setOutputText(furiganaResponse.data.result);

      // If translate is enabled, also translate
      if (translateEnabled) {
        try {
          const translateResponse = await axios.post(
            "https://flask-furigana-generator.vercel.app/translate",
            {
              text: inputText,
            }
          );
          console.log(translateResponse);
          setTranslation(translateResponse.data.translations[0].translated_text);
        } catch (translateError) {
          console.error("Error translating text:", translateError);
          setTranslation("Translation failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error fetching Furigana:", error);
      setOutputText({ furigana: "Failed to fetch Furigana. Please try again", hiragana: "" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - you can change this to any password you want
    if (password === import.meta.env.VITE_TRANSLATE_PASSWORD) {
      setTranslateEnabled(true);
      setShowPasswordModal(false);
      setPassword("");
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password");
    }
  };

  const handleToggleTranslate = () => {
    if (!translateEnabled) {
      setShowPasswordModal(true);
    } else {
      setTranslateEnabled(false);
      setTranslation("");
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
        
        {/* Translate Toggle */}
        <div className="mt-8 flex items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={translateEnabled}
              onChange={handleToggleTranslate}
              className="sr-only"
            />
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              translateEnabled ? 'bg-[#8C4843]' : 'bg-gray-300'
            }`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                translateEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700">
              Enable Translation
            </span>
          </label>
        </div>

        <button
            onClick={handleButtonClick}
            disabled={disabled}
            className={`mt-8 w-64 px-4 py-2 bg-[#8C4843] text-white ${
              disabled ? "cursor-not-allowed opacity-60" : ""
            }`}
          >
            Generate
        </button>

        {/* Translation Display */}
        {translation && (
          <div className="mt-8 w-96 p-4 border border-[#1E1E1E] bg-[#F0F0F0] rounded">
            <div className="text-sm font-medium text-gray-700 mb-2">Translation:</div>
            <div className="text-gray-900">{translation}</div>
          </div>
        )}
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Enter Password to Enable Translation</h3>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C4843] focus:border-transparent"
                autoFocus
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-2">{passwordError}</p>
              )}
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPassword("");
                    setPasswordError("");
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8C4843] text-white rounded-md hover:bg-[#7A3F3A]"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
