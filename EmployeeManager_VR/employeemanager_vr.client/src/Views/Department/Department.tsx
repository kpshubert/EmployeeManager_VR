import React, { useEffect, useState } from 'react';
import './Department.css';
import '../../Models/departmentmodel';
import type { DepartmentModel } from '../../Models/departmentmodel';

function Department() {
    const [departments, setDepartments] = useState<DepartmentModel[]>();
    const [firstNameValue, setFirstNameValue] = useState(''); 

    useEffect(() => {
        populateDepartmentData();
    }, []);

    const handleFirstNameChange = (event) => {
        setFirstNameValue(event.target.value);
    }

    const contents = departments === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <table className="table table-striped table-hover" aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th>Department Name</th>
                </tr>
            </thead>
            <tbody>
                {departments.map(department =>
                    <tr key={department.name}>
                        <td>{department.name}</td>
                    </tr>
                )}
            </tbody>
            <label htmlFor="txtDepartmentName">Department Name</label>
            <input id="txtDepartmentName" type="text" value={firstNameValue} onChange={handleFirstNameChange}></input>
        </table>;

    return (
        <div>
            <h1 id="tableLabel">Departments</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {contents}
        </div>
    );

    async function populateDepartmentData() {
        const response = await fetch('department?id=0&mode=list');
        if (response.ok) {
            const data = await response.json();
            setDepartments(data);
        }
    }
}
export default Department;