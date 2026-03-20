import { useEffect, useState, useCallback } from "react";
import "../App.css";
import { useDropzone } from "react-dropzone";
import SavingsChart from "./SavingsChart";

const Categories = [
    { id: "surplus", label: "Surplus"},
    { id: "keyboards", label: "Keyboards"},
    { id: "gym", label: "Gym"},
    { id: "groceries", label: "Groceries" },
    { id: "car_parts", label: "Car Parts" },
    { id: "computer_hardware", label: "Computer Hardware" },
    { id: "gaming_mice", label: "Gaming Mice" },
    { id: "rent", label: "Rent" },
    { id: "utilities", label: "Utilities" },
    { id: "transportation", label: "Transportation" },
    { id: "entertainment", label: "Entertainment" },
    { id: "subscriptions", label: "Subscriptions" },
    { id: "other", label: "Other" }
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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function DashboardForm(){
    const [category, setCategory] =useState("");
    const [amount, setAmount] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [image, setImage] = useState<File[] | null>(null);
    const [goal, setGoal] = useState(5000);

    const totalSpent = expenses.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    async function submitExpense() {
        if (!category || !amount || !date) return;

        const formData = new FormData();
        formData.append("hobby", category);
        formData.append("description", description);
        formData.append("location", location);
        formData.append("amount", amount);
        formData.append("expense_date", date);

        if (image) formData.append("image", image[0]);

        await fetch(`${API_BASE_URL}/expenses`, {
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

    async function deleteExpense(id: number) {
        try {
            await fetch(`${API_BASE_URL}/delete/${id}`, {
                method: "DELETE",
            });

            console.log("Deleted from database!");
            fetchExpenses();
        } catch (error) {
            console.error(error);
        }
    }

    async function fetchExpenses() {
        const res = await fetch(`${API_BASE_URL}/expenses`);
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
    });

return (
<div className="app-container">

{/* NAVBAR */}
<nav className="navbar">
<div className="nav-left">
<h1 className="app-title">Hobbyist Tracker</h1>
</div>
</nav>

{/* PAGE CONTENT */}
<div className="dashboard-wrapper">

{/* TOP ROW */}
<div className="top-row">

<div className="field">
<label htmlFor="category">Category</label>
<select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
<option value="">Select</option>
{Categories.map((cat) => (
<option key={cat.id} value={cat.id}>
{cat.label}
</option>
))}
</select>
</div>

<div className="field">
<label htmlFor="amount">$ Spent</label>
<input
id="amount"
type="number"
value={amount}
onChange={(e) => setAmount(e.target.value)}
/>
</div>

<div className="field">
<label htmlFor="location">Location</label>
<input
id="location"
value={location}
onChange={(e) => setLocation(e.target.value)}
/>
</div>

<div className="field">
<label htmlFor="date">Date</label>
<input
id="date"
type="date"
value={date}
onChange={(e) => setDate(e.target.value)}
/>
</div>

</div>

{/* MAIN GRID */}
<div className="main-row">

{/* LEFT PANEL */}
<aside className="history">
<h3>Finance History</h3>

{expenses.map((e) => (
<div key={e.id} className="history-item">
<div>{e.hobby}</div>
<div>${e.amount}</div>
<small>{new Date(e.expense_date).toLocaleDateString()}</small>
<div>{e.description}</div>

<div className="ImageanButton-Container">
{e.image_path && <img src={`${API_BASE_URL}/${e.image_path}`} />}

<div className="button-container">
<button className="button-style" onClick={() => deleteExpense(e.id)}>
Delete
</button>
</div>
</div>
</div>
))}

</aside>

{/* CENTER PANEL */}
<main className="center">

<div className="image-drop">

<div {...getRootProps()} className="dropzone">
<input {...getInputProps()} />

{!image && (
isDragActive ? (
<p>Drop the files here ...</p>
) : (
<p>Drag and drop some files here, or click to select files</p>
)
)}

</div>

{image && image.length > 0 && (
<img src={URL.createObjectURL(image[0])} alt="Preview" />
)}

</div>

<textarea
id="description"
placeholder="What's the item for today?"
value={description}
onChange={(e) => setDescription(e.target.value)}
/>

<button onClick={submitExpense}>Add Expense</button>

</main>

{/* RIGHT PANEL (CHART) */}
<aside className="chart">

<h3>Finance goals chart</h3>

<div className="chart-container">
<SavingsChart totalSpent={totalSpent} goal={goal} />
</div>
<p className="total-spent"> Total Spendings: {totalSpent} </p>
<div className="field">
<input 
    type="number"
    placeholder="Enter savings goal"
    value={goal}
    onChange={(e) => setGoal(Number(e.target.value))}
/>
</div> 


</aside>

</div>
</div>

<footer className="footer">Hobbyist Tracker © 2026</footer>

</div>
);
}