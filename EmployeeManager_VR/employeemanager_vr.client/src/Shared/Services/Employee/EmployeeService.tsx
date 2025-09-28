import type { EmployeeModel } from "../../../Models/employeemodel";

export async function fetchEmployees(id: number, mode: string = '') {
    try {
        const response = await fetch(`/employee?id=${id}&mode=${mode}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        return error.message;
    }
}

export async function postEmployeeData(employeeToUpdate: EmployeeModel) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeToUpdate)
    };
    const response = await fetch('/employee', requestOptions);
    return response;
}

//Delete data
export async function removeEmployee(id: number) {
    if (window.confirm("Are you sure?")) {

        await fetch(`/employee?id=${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'content-Type': 'application/json'
                }
            })
            .then(response => {
                console.log("Deleted");
                return response;
            })
            .catch(err => console.log(err));
    }
}