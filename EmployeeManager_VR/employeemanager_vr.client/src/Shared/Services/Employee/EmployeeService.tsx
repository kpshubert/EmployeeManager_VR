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