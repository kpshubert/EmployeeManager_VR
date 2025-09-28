import type DepartmentModel from '../../../Models/departmentmodel';

export async function fetchDepartments(id: number, mode: string = '') {
    try {
        const response = await fetch(`/department?id=${id}&mode=${mode}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        return error.message;
    }
}

export async function postDepartmentData(departmentToUpdate: DepartmentModel) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(departmentToUpdate)
    };
    const response = await fetch('/department', requestOptions);
    return response;
}


//Delete data
export async function removeDepartment(id: number) {
    if (window.confirm("Are you sure?")) {

        await fetch(`/department?id=${id}`,
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
};