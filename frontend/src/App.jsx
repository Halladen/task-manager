import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const modalHide = () => {
    setShowModal(false);
    setCurrentTask(null);
  };

  const modalShow = () => {
    setShowModal(true);
  };

  const refreshTasks = () => {
    const apiUrl = "http://127.0.0.1:8000/api/tasks/";
    axios
      .get(apiUrl)
      .then((response) => setTasks(response.data))
      .catch((e) => console.log("Error connecting to the api: ", e));
  };

  const addTask = (task) => {
    const apiUrl = "http://127.0.0.1:8000/api/tasks/";
    axios
      .post(apiUrl, task)
      .then((response) => refreshTasks())
      .catch((e) => console.log("Error connecting to the api: ", e));
  };

  const deleteTask = (task) => {
    const apiUrl = `http://127.0.0.1:8000/api/tasks/${task.id}/`;
    axios
      .delete(apiUrl)
      .then((res) => refreshTasks())
      .catch((e) => console.log("Error connecting to the api: ", e));
  };

  const editTask = (task) => {
    console.log("updating is continue");
    const apiUrl = `http://127.0.0.1:8000/api/tasks/${task.id}/`;
    axios
      .put(apiUrl, task)
      .then((res) => refreshTasks())
      .catch((e) => console.log("Error connecting to the api: ", e));
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  const renderTasks = () => {
    const items = tasks.filter((item) => item.completed == showCompleted);
    return items.map((item) => (
      <li
        key={item.id}
        className="list-group list-group-flush border p-1 mb-2 rounded"
      >
        <div className="d-flex justify-content-between">
          <div
            className={`${showCompleted ? "text-decoration-line-through" : ""}`}
          >
            {item.title}
          </div>
          <div className="">
            <button
              className="btn btn-sm btn-warning me-2"
              onClick={() => {
                setCurrentTask(item);
                modalShow();
              }}
            >
              View-Edit
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => deleteTask(item)}
            >
              Delete
            </button>
          </div>
        </div>
      </li>
    ));
  };
  return (
    <div>
      <div
        className="container-fluid bg-info d-flex flex-column gap-3 text-center justify-content-center"
        style={{ filter: `${showModal ? "blur(2px)" : "none"}` }}
      >
        <div className="h4 mt-5">Task Manager</div>
        <div
          className="bg-white border rounded border-black w-50 mx-auto p-3 text-start"
          style={{ minHeight: "400px" }}
        >
          <button className="btn btn-md btn-warning" onClick={modalShow}>
            Add Task
          </button>
          <div className="group-list my-3 ms-4">
            <button
              type="button"
              className={`rounded border me-3 ${
                showCompleted ? "bg-primary" : ""
              }`}
              onClick={() => setShowCompleted(true)}
            >
              completed
            </button>
            <button
              type="button"
              className={`rounded border me-3 ${
                showCompleted ? "" : "bg-primary"
              }`}
              onClick={() => setShowCompleted(false)}
            >
              incompleted
            </button>
          </div>
          <div>
            <ul>{renderTasks()}</ul>
          </div>
        </div>
        <div className="mb-3">Copyright 2024 &copy; All Rights Reserved</div>
      </div>

      <ModalDialog
        update={editTask}
        show={showModal}
        add={addTask}
        hide={modalHide}
        edit={currentTask}
      />
    </div>
  );
}

const ModalDialog = ({ show, hide, add, edit, update }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (edit) {
      setTitle(edit.title);
      setDescription(edit.description);
      setCompleted(edit.completed);
    } else {
      setTitle("");
      setDescription("");
      setCompleted(false);
    }
  }, [edit]);
  const onSave = (e) => {
    e.preventDefault;
    const task = { title, description, completed };
    console.log("submitted", e.target.title.value);
    if (edit) {
      task.id = edit.id;
      update(task);
    }

    hide();
  };

  return (
    <div
      className="modal"
      tabIndex="-1"
      style={{ display: `${show ? "block" : "none"}` }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <div className="h6">Task</div>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={hide}
            ></button>
          </div>
          <div className="modal-body text-start">
            <form action="" onSubmit={(e) => onSave(e)}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                name="title"
                value={title}
                className="form-control mb-2"
                placeholder="Enter title"
              />

              <label htmlFor="description">Description</label>
              <input
                type="text"
                onChange={(e) => setDescription(e.target.value)}
                name="description"
                value={description}
                className="form-control mb-2"
                placeholder="Enter description"
              />

              <input
                type="checkbox"
                onChange={(e) => setCompleted(e.target.checked)}
                name="completed"
                checked={completed}
                className="check me-2"
              />
              <label htmlFor="checkbox">completed</label>

              <hr />
              <div className="d-flex justify-content-end">
                <button className="btn btn-warning me-2" onClick={hide}>
                  Close
                </button>
                <button type="submit" className="btn btn-info">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
