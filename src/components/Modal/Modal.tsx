import { tagLabels } from "../../utils";
import { addTaskToTheServer } from "../../utils";
import { ModalProps, Task } from "../../types";
import "./Modal.css";
import { useRef, useState } from "react";

export const Modal = ({ setAllTasks, allTasks, setIsModalOpen }: ModalProps) => {
  const [textInput, setTextInput] = useState("");
  const [invalidInput, setInvalidInput] = useState(false);
  const tagRadioRefs = useRef<HTMLInputElement[]>([]);
  const modalDateRef = useRef<HTMLInputElement>(null);

  const today = new Date().toISOString().split("T")[0];

  const closeModal = () => {
    setTextInput("");
    if (modalDateRef.current) {
      modalDateRef.current.value = today;
    }
    setIsModalOpen(false);
  };
  

  const addTask = () => {
    const dateValueParsed = new Date(modalDateRef.current!.value);
    if (!textInput) {
      setInvalidInput(true);
      alert("Please enter a valid task title");
      return;
    }
    const selectedTagRadio = tagRadioRefs.current.find((radio) => radio.checked);
  const selectedTag = selectedTagRadio ? selectedTagRadio.value : tagLabels[0].tag;

    const newTask: Task = {
      title: textInput,
      isCompleted: false,
      tag: selectedTag,
      date: dateValueParsed,
    };
    closeModal();

    addTaskToTheServer(newTask).then((response) => {
      newTask._id = response._id;
      newTask.updatedAt = response.updatedAt;
      const newTasks = allTasks ? [newTask, ...allTasks] : [newTask];
      setAllTasks(newTasks);
    });
  };

  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const selectedTag = event.target.value;

  tagRadioRefs.current.forEach((tagRadioRef) => {
    const tagLabelElement = tagRadioRef.parentElement as HTMLLabelElement;
    if (tagRadioRef.value === selectedTag) {
      tagLabelElement.style.border = `1px solid ${tagLabels.find((tagLabel) => tagLabel.tag === selectedTag)?.color}`;
    } else {
      tagLabelElement.style.border = "none";
    }
  });
};

  return (
    <form
      className="modal"
      onSubmit={(e) => {
        e.preventDefault();
        addTask();
      }}
    >
      <label className="modal-title">Add New Task</label>
      <input
        type="text"
        placeholder="Task Title"
        id="modal-input"
        autoFocus
        style={{ border: !textInput && invalidInput ? "1px solid #E38889" : "1px solid #3c86f4" }}
        onChange={(e) => {
          setTextInput(e.target.value.trim());
        }}
      />
      <div className="tag-date-container">
        <div className="tag-container">
          {tagLabels.map((tagLabel, index) => (
            <label
              className="tag-label"
              key={tagLabel.id}
              style={{
                border: tagLabels[0].tag === tagLabel.tag ? `1px solid ${tagLabel.color}` : "none", backgroundColor: tagLabel.bgColor, color: tagLabel.color,
              }}
            >
              <input
                type="radio"
                name="tags"
                value={tagLabel.tag}
                ref={(el) => (tagRadioRefs.current[index] = el as HTMLInputElement)}
                onChange={handleTagChange}
              />
              {tagLabel.tag}
            </label>
          ))}
        </div>
        <input
          type="date"
          placeholder="Due Date"
          min={today}
          defaultValue={today}
          id="modal-date"
          ref={modalDateRef}
        />
      </div>
      <div className="modal-button-container">
        <button
          className="cancel-button"
          type="button"
          onClick={() => {
            closeModal();
          }}
        >
          Cancel
        </button>
        <button className="add-button" type="submit" style={textInput.length ? { backgroundColor: "#3c86f4" } : {}}>
          Add
        </button>
      </div>
    </form>
  );
};