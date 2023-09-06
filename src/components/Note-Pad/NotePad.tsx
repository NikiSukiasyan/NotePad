import React, { useState, useEffect } from "react";
import AddIcon from "../../images/add-icon.png";
import { GrAddCircle } from "react-icons/gr";

type Note = {
  title: string;
  content: string[];
  color: string;
  isOpen?: boolean;
};

type NotePadProps = {
  updateNotes: (newNote: Note) => void;
};

function NotePad({ updateNotes }: NotePadProps) {
  const [title, setTitle] = useState<string>("");
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [coloredDivsVisible, setColoredDivsVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isNewNotePadVisible, setIsNewNotePadVisible] = useState(false);
  const colors = ["red", "green", "yellow", "violet", "orange"];
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const savedIsNewNotePadVisible = localStorage.getItem(
      "isNewNotePadVisible"
    );
    if (savedIsNewNotePadVisible) {
      setIsNewNotePadVisible(JSON.parse(savedIsNewNotePadVisible));
    }

    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "isNewNotePadVisible",
      JSON.stringify(isNewNotePadVisible)
    );
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [isNewNotePadVisible, notes]);

  const toggleColoredDivs = () => {
    setColoredDivsVisible(!coloredDivsVisible);
  };

  const selectColor = (color: string) => {
    setSelectedColor(color);
    setColoredDivsVisible(false);
    setIsNewNotePadVisible(true);
  };

  const addNoteInput = () => {
    setParagraphs([...paragraphs, ""]);
  };

  const handleParagraphChange = (index: number, newText: string) => {
    const updatedParagraphs = [...paragraphs];
    updatedParagraphs[index] = newText;
    setParagraphs(updatedParagraphs);
  };

  const handleCreateNote = () => {
    if (
      title.trim() !== "" &&
      paragraphs.some((paragraph) => paragraph.trim() !== "") &&
      selectedColor
    ) {
      const newNote: Note = {
        title,
        content: paragraphs,
        color: selectedColor,
      };
      updateNotes(newNote);
      setTitle("");
      setParagraphs([]);
      setIsNewNotePadVisible(false);
    } else {
      alert("გთხოვთ შეავსოთ ყველა ტასკი");
    }
  };

  return (
    <>
      <div className="fixed right-3 bottom-5 flex items-center gap-4">
        {coloredDivsVisible && (
          <div
            className={`flex gap-[12px] duration-300 ${
              coloredDivsVisible
                ? `w-${colors.length * 48 + (colors.length - 1) * 12}px`
                : "w-0"
            }`}
          >
            {colors.map((color, index) => (
              <div
                key={index}
                className={`bg-${color}-300 w-6 h-6 rounded-full cursor-pointer`}
                onClick={() => selectColor(color)}
              ></div>
            ))}
          </div>
        )}
        <GrAddCircle
          size={50}
          className="cursor-pointer"
          onClick={toggleColoredDivs}
        />
      </div>
      {isNewNotePadVisible && (
        <div
          id="#notePad"
          className={`w-[500px] min-h-[500px] bg-${selectedColor}-300 absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-10%] rounded-md z-[999]`}
        >
          <div className="w-full flex justify-center">
            <input
              type="text"
              className="title-input"
              placeholder="Title Of Note"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          {paragraphs.map((paragraph, index) => (
            <input
              key={index}
              type="text"
              placeholder="note"
              className="note-input"
              value={paragraph}
              onChange={(e) => handleParagraphChange(index, e.target.value)}
            />
          ))}
          <img
            src={AddIcon}
            alt="Plus icon"
            className="absolute right-[15px] bottom-[10px] w-[50px] h-[50px] cursor-pointer"
            onClick={addNoteInput}
          />
          <button className="add-btn" onClick={handleCreateNote}>
            Create Note
          </button>
        </div>
      )}
    </>
  );
}

export default NotePad;
