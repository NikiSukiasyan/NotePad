import React, { useState, useEffect } from "react";
import "./App.css";
import NotePad from "./components/Note-Pad/NotePad";
import { MdDone } from "react-icons/md";
import {
  AiFillDelete,
  AiOutlineCloudDownload,
  AiOutlinePlus,
} from "react-icons/ai";
import { BsFillCloudDownloadFill } from "react-icons/bs";

function App() {
  const [notes, setNotes] = useState<
    { title: string; content: string[]; color: string; isOpen: boolean }[]
  >([]);
  const [markedParagraphs, setMarkedParagraphs] = useState<boolean[][]>([]);

  const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
  const savedMarkedParagraphs = JSON.parse(
    localStorage.getItem("markedParagraphs") || "[]"
  );

  useEffect(() => {
    setNotes(savedNotes);
    setMarkedParagraphs(savedMarkedParagraphs);
  }, []);

  const toggleOpenNote = (noteIndex: number) => {
    const updatedNotes = [...notes];
    updatedNotes[noteIndex].isOpen = !updatedNotes[noteIndex].isOpen;
    setNotes(updatedNotes);
  };

  const deleteNote = (noteIndex: number) => {
    const updatedNotes = [...notes];
    updatedNotes.splice(noteIndex, 1);
    setNotes(updatedNotes);

    const updatedMarkedParagraphs = [...markedParagraphs];
    updatedMarkedParagraphs.splice(noteIndex, 1);
    setMarkedParagraphs(updatedMarkedParagraphs);
  };

  const updateNotes = (newNotes: {
    title: string;
    content: string[];
    color: string;
  }) => {
    const initialContents = newNotes.content.map(() => "");

    const updatedNotes = [...notes, { ...newNotes, isOpen: false }];
    setNotes(updatedNotes);

    const updatedMarkedParagraphs = [
      ...markedParagraphs,
      newNotes.content.map(() => false),
    ];
    setMarkedParagraphs(updatedMarkedParagraphs);
  };

  const toggleMarkParagraph = (noteIndex: number, paragraphIndex: number) => {
    const updatedMarkedParagraphs = [...markedParagraphs];
    updatedMarkedParagraphs[noteIndex][paragraphIndex] =
      !updatedMarkedParagraphs[noteIndex][paragraphIndex];
    setMarkedParagraphs(updatedMarkedParagraphs);
  };

  const downloadNote = (note: {
    title: string;
    content: string[];
    color: string;
  }) => {
    const blob = new Blob([note.content.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllNotes = () => {
    notes.forEach((note) => {
      downloadNote(note);
    });
  };

  const handleParagraphEdit = (
    noteIndex: number,
    paragraphIndex: number,
    e: React.ChangeEvent<HTMLDivElement>
  ) => {
    const updatedNotes = [...notes];
    updatedNotes[noteIndex].content[paragraphIndex] = e.target.innerText;
    setNotes(updatedNotes);

    const updatedMarkedParagraphs = [...markedParagraphs];
    updatedMarkedParagraphs[noteIndex][paragraphIndex] = false;
    setMarkedParagraphs(updatedMarkedParagraphs);
  };

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("markedParagraphs", JSON.stringify(markedParagraphs));
  }, [notes, markedParagraphs]);

  return (
    <>
      <NotePad updateNotes={updateNotes} />
      <header>
        <h1 className="text-center text-[50px]">NotePad</h1>
      </header>
      <div className="flex gap-6 justify-center mt-[50px] main-container">
        {notes.map((note, noteIndex) => (
          <div
            key={noteIndex}
            className={`bg-${note.color}-300 rounded-xl duration-300 ${
              note.isOpen
                ? "w-[450px] min-h-[500px]"
                : "w-[150px] min-h-[200px]"
            } pl-[10px] pr-[10px]`}
          >
            <h2 className="text-center pb-[15px]">{note.title}</h2>
            <div className="flex gap-[10px] items-center justify-between note-container">
              <div className="flex flex-col">
                {note.content.map((paragraph, paragraphIndex) => (
                  <div
                    key={paragraphIndex}
                    className="flex items-center justify-between outline-none"
                    contentEditable={true}
                    onBlur={(e) =>
                      handleParagraphEdit(noteIndex, paragraphIndex, e)
                    }
                    style={{
                      textDecoration: markedParagraphs[noteIndex][
                        paragraphIndex
                      ]
                        ? "line-through"
                        : "none",
                    }}
                  >
                    {paragraph}
                    <MdDone
                      size={15}
                      className="cursor-pointer"
                      onClick={() =>
                        toggleMarkParagraph(noteIndex, paragraphIndex)
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between flex-wrap">
                <button
                  onClick={() => toggleOpenNote(noteIndex)}
                  className="cursor-pointer"
                >
                  {note.isOpen ? "Close" : "Open"}
                </button>
                <AiFillDelete
                  size={20}
                  className="cursor-pointer"
                  onClick={() => deleteNote(noteIndex)}
                />
                <AiOutlineCloudDownload
                  size={20}
                  className="cursor-pointer"
                  onClick={() => downloadNote(note)}
                />
                <AiOutlinePlus size={20} className="cursor-pointer" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <BsFillCloudDownloadFill
        size={30}
        className="cursor-pointer fixed bottom-3 left-3"
        onClick={downloadAllNotes}
      />
    </>
  );
}

export default App;
