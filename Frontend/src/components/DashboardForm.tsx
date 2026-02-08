import { useEffect, useState, useCallback } from "react";
import "../App.css";
import { useDropzone } from "react-dropzone";

const Categories = [
    { id: "surplus", label: "Surplus"},
    { id: "keyboards", label: "Keyboards"},
    { id: "gym", label: "Gym"},
];

type Expense = {
  id: number;
  hobby: string;
  description: string | null;
  location: string | null;
  amount: number;
  expense_date: string;
  image_path: string | null;
  created_at: string;
};

export default function DashboardForm(){
    const [category, setCategory] =useState("");
    const [amount, setAmount] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [image, setImage] = useState<File[] | null>(null);
    async function submitExpense() {
        if (!category || !amount || !date) return;
        const formData = new FormData();
        formData.append("hobby", category);
        formData.append("description", description);
        formData.append("location", location);
        formData.append("amount", amount);
        formData.append("expense_date", date);
        if (image) formData.append("image", image[0]);

        await fetch("http://localhost:3001/expenses", {
            method: "POST",
            body: formData,
        });

    fetchExpenses();

    setCategory("");
    setAmount("");
    setDate("");
    setDescription("");
    setImage(null);
  }

  async function fetchExpenses() {
    const res = await fetch("http://localhost:3001/expenses");
    const data = await res.json();
    setExpenses(data);
  }

  useEffect(() => {
    fetchExpenses();
  }, []);

  const { getRootProps, getInputProps, isDragActive} = useDropzone({
      onDrop: useCallback((images: File[]) => {
          setImage(images);
      }, []),
  })

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/';

return (
    <div className="dashboard-wrapper">
      {/* TOP ROW */}
      <div className="top-row">
        <div className="field">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select</option>
            {Categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>$ Spent</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="main-row">
        {/* LEFT */}
        <aside className="history">
          <h3>Finance History</h3>
          {expenses.map((e) => (
            <div key={e.id} className="history-item">
              <div>{e.hobby}</div>
              <div>${e.amount}</div>
              <small>{e.expense_date}</small>
              <div>{e.description}</div>
              {e.image_path && <img src={`${API_BASE_URL}${e.image_path}`}></img>}
            </div>
          ))}
        </aside>

        {/* CENTER */}
        <main className="center">
          <div className="image-drop">
            <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the files here ...</p>
            ) : (
                <p>Drag and drop some files here, or click to select files</p>
            )}
            </div>
            {image && image.length > 0 && (
                <img src={URL.createObjectURL(image[0])} alt="Preview" />
            )}
          </div>

          <textarea
            placeholder="What's the item for today?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button onClick={submitExpense}>Add Expense</button>
        </main>

        {/* RIGHT */}
        <aside className="chart">
          <h3>Finance goals chart</h3>
          <div className="chart-placeholder"></div>
        </aside>
      </div>

      {/* FOOTER */}
      <footer className="footer">Footer</footer>
    </div>
  );
}