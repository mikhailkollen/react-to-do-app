import { tagLabels } from "../../utils";
import { Task } from "../../types";
import "./Modal.css";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setIsModalOpen } from "../../features/tasks/tasksSlice";
import { addTask as addTaskToTheServer, updateTask as updateTaskOnTheServer } from "../../features/tasks/tasksThunk";

export const Modal = () => {
  const editedTask = useAppSelector((state) => state.tasks.editedTask);
  const [textInput, setTextInput] = useState(editedTask ? editedTask.title : "");
  const [invalidInput, setInvalidInput] = useState(false);
  const tagRadioRefs = useRef<HTMLInputElement[]>([]);
  const modalDateRef = useRef<HTMLInputElement>(null);

  const today = new Date().toISOString().split("T")[0];
  const dispatch = useAppDispatch();

  const closeModal = () => {
    setTextInput("");
    if (modalDateRef.current) {
      modalDateRef.current.value = today;
    }
    dispatch(setIsModalOpen(false));
  };

  useEffect(() => {
    if (editedTask) {
      setTextInput(editedTask.title);
      modalDateRef.current!.value = editedTask.date.split("T")[0];
      const selectedTagRadio = tagRadioRefs.current.find((radio) => radio.value === editedTask.tag);
      if (selectedTagRadio) {
        selectedTagRadio.checked = true;
      }
    }
  }, [editedTask]);

  const addTask = () => {
    if (!textInput.trim()) {
      setInvalidInput(true);
      return;
    }
    const dateValueParsed = new Date(modalDateRef.current!.value);
    const selectedTagRadio = tagRadioRefs.current.find((radio) => radio.checked);
    const selectedTag = selectedTagRadio ? selectedTagRadio.value : tagLabels[0].tag;

    const newTask: Task = {
      title: textInput.trim(),
      isCompleted: false,
      tag: selectedTag,
      date: dateValueParsed.toISOString(),
    };
    closeModal();

    dispatch(addTaskToTheServer(newTask));
  };

  const updateTask = () => {
    const dateValueParsed = new Date(modalDateRef.current!.value);
    if (!textInput.trim()) {
      setInvalidInput(true);
      return;
    }
    const selectedTagRadio = tagRadioRefs.current.find((radio) => radio.checked);
    const selectedTag = selectedTagRadio ? selectedTagRadio.value : tagLabels[0].tag;

    const updatedTask: Task = {
      ...editedTask!,
      title: textInput.trim(),
      tag: selectedTag,
      date: dateValueParsed.toISOString(),
    };
    closeModal();

    dispatch(updateTaskOnTheServer(updatedTask));
  };

  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTag = event.target.value;

    tagRadioRefs.current.forEach((tagRadioRef) => {
      const tagLabelElement = tagRadioRef.parentElement as HTMLLabelElement;
      if (tagRadioRef.value === selectedTag) {
        tagLabelElement.style.border = `1px solid ${tagLabels.find((tagLabel) => tagLabel.tag === selectedTag)?.color}`;
        tagRadioRef.checked = true;
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
        if (editedTask) {
          updateTask();
        } else {
          addTask();
        }
      }}
    >
      <label className="modal-title">{editedTask ? "Edit the task" : "Add New Task"}</label>
      <input
        type="text"
        placeholder="Task Title"
        id="modal-input"
        autoFocus
        style={{ border: !textInput && invalidInput ? "1px solid #E38889" : "1px solid #3c86f4" }}
        defaultValue={editedTask ? editedTask.title : ""}
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
                border: editedTask ? editedTask?.tag === tagLabel.tag ? `1px solid ${tagLabel.color}` : "none" : tagLabels[0].tag === tagLabel.tag ? `1px solid ${tagLabel.color}` : "none", backgroundColor: tagLabel.bgColor, color: tagLabel.color,
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
          {editedTask ? "Edit" : "Add"}
        </button>
      </div>
    </form>
  );
};