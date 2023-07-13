const saveDataOnSession = () => {
    sessionStorage.setItem("data", JSON.stringify(data));
};

const getDataFromSession = () => {
    const data = sessionStorage.getItem("data") || JSON.stringify([]);
    return JSON.parse(data);
};

let data = getDataFromSession();

const getAllData = async () => {
    const res = await fetch("http://localhost:3001/getAllData");
    const result = await res.json();
    data = result;
    saveDataOnSession();
    renderData();
};

const renderData = () => {
    const dataTable = document.getElementById("data");
    dataTable.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Actions</th>
        </tr>
    `;

    const uniqueData = new Set();

    data.forEach((item) => {
        const dataKey = `${item.name}-${item.roll_no}-${item.address}-${item.phone}-${item.email}`;
        if (!uniqueData.has(dataKey)) {
            uniqueData.add(dataKey);
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.roll_no}</td>
                <td>${item.address}</td>
                <td>${item.phone}</td>
                <td>${item.email}</td>
                <td>
                    <button id="${item.user_id}" onclick="deleteData(${item.user_id})">Delete</button>
                    <button onclick="edit(${item.user_id})">Update</button>
                </td>
            `;
            dataTable.appendChild(row);
        }
    });
};

renderData();

const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    await fetch("http://localhost:3001/form", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    await getAllData();
};

const deleteData = async (id) => {
    await fetch(`http://localhost:3001/user/${id}`, {
        method: "DELETE",
    });
    await getAllData();
};

const updateData = async (e, id) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await fetch(`http://localhost:3001/user/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
    });
    await getAllData();
    form.setAttribute("onsubmit", "handleSubmit(event)");
};

const edit = (id) => {
    const selectedData = data.find((item) => item.user_id === id);
    const form = document.querySelector("form");
    form.querySelector("input[name='name']").value = selectedData.name;
    form.querySelector("input[name='roll_no']").value = selectedData.roll_no;
    form.querySelector("input[name='address']").value = selectedData.address;
    form.querySelector("input[name='phone']").value = selectedData.phone;
    form.querySelector("input[name='email']").value = selectedData.email;
    form.setAttribute("onsubmit", `updateData(event,${id})`);
};
