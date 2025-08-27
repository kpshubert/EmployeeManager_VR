import { useEffect, useState } from 'react';
import './Employee.css';
import type { EmployeeModel } from '../../Models/employeemodel';

function Employee() {
    const [employees, setEmployees] = useState<EmployeeModel[]>();

    useEffect(() => {
        populateEmployeeData();
    }, []);

    const contents = employees === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <table className="table table-striped" aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Phone Number</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                {employees.map(employee =>
                    <tr key={employee.id}>
                        <td>{employee.firstName}</td>
                        <td>{employee.lastName}</td>
                        <td>{employee.phone}</td>
                        <td>{employee.email}</td>
                    </tr>
                )}
            </tbody>
        </table>;

    return (
        <div>
            <h1 id="tableLabel">Employee Data</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {contents}
        </div>
    );

    async function populateEmployeeData() {
        const response = await fetch('employee?id=0&mode=list');
        if (response.ok) {
            const data = await response.json();
            setEmployees(data);
        }
    }
}

export default Employee;