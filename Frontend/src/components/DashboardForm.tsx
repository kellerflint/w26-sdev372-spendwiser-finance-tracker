import { useState } from "react";

const Categories = [
    { id: "surplus", label: "Surplus"},
    { id: "keyboards", label: "Keyboards"},
    { id: "gym", label: "Gym"},
];

export default function DashboardForm(){
    const [category, setCategory] =useState("");
    const [amount, setAmount] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");

    return(
    <div>
        <div>
            <label>Category</label>
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                >
                <option value="">Select</option>
                {Categories.map((cat) =>(
                    <option key={cat.id} value={cat.id}>
                    {cat.label}
                    </option>
                ))}  
            </select>
         </div> 
        <div>
            <label>$ Spent</label>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                />
        </div>
        <div>
            <label>Location</label>
            <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            />
        </div>
        <div>
            <label>Date</label>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                />
        </div>
    <div>
        <label>Description</label>
        <textarea
         value={description}
         onChange={(e) => setDescription(e.target.value)}
        rows={6}
        cols={30}
    />
    </div>
    </div>
    )
}