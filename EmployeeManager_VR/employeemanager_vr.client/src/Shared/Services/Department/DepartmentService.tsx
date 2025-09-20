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