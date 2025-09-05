import { useEffect, useState } from 'react';
import './Employee.css';
import type { EmployeeModel } from '../../Models/employeemodel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEdit, faWindowClose } from '@fortawesome/free-regular-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Employee = () => {

    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    let currentEmployee: EmployeeModel = {
        rowNum: 0,
        id: 0,
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        departmentId: 0,
        departmentIdString: '0',
        departmentName: '',
        formMode: 'add'
    };

    const getEmployees = () => {
        fetch('/employee?id=0&mode=list')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Employee get failed');
                }
                return response.json();
            })
            .then(data => {
                setEmployees(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }

    const getDepartments = () => {
        fetch('/department?id=0&mode=list')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Departments get failed');
                }
                return response.json();
            })
            .then(data => {
                setDepartments(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }

    useEffect(() => {
        getEmployees();
        getDepartments();

        // Optionally, return a cleanup function if needed
        return () => {
            // Cleanup code here if necessary
        };
    }, []); // Empty dependency array means this effect runs once, like componentDidMount

    const onInputChange = (event) => {
    }

    const onSubmitForm = (event) => {
    }

    const loadingDisplay =
        <div>
            <div className="row mb-2">
                <div className="col-md-12">
                    <FontAwesomeIcon icon={faSpinner} className="fa-spin" size="2x"></FontAwesomeIcon>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    Loading Employee Information...
                </div>
            </div>
        </div>;

    const errorDisplay =
        <div>Error: {error}</div>;

    const renderSelectControlOptions = () => {
        const rows = [];
        if (departments != null && departments.length !== 0) {
            for (let currentDepartment = 0; currentDepartment < departments.length; currentDepartment++) {
                const department = departments[currentDepartment];
                rows.push(
                    <option value={department.idString}>{department.name}</option>
                );
            }
        }
        return rows;
    }

    const optionList = renderSelectControlOptions();

    const renderTable = () => {
        const rows = [];
        if (employees !== null && employees.length !== 0) {
            for (let currentEmployee = 0; currentEmployee < employees.length; currentEmployee++) {
                const employee = employees[currentEmployee];
                rows.push(
                    <tr key={currentEmployee}>
                        <td>
                            <button type="button" className="btn btn-success" value={employee.idString}>
                                <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                            </button>
                            <button type="button" className="btn btn-danger" value={employee.idString}>
                                <FontAwesomeIcon icon={faWindowClose}></FontAwesomeIcon>
                            </button>
                        </td>
                        <td>{employee.firstName}</td>
                        <td>{employee.lastName}</td>
                        <td>{employee.phone}</td>
                        <td>{employee.email}</td>
                        <td>{employee.departmentName}</td>
                    </tr>
                );
            }
        }
        return rows;
    }

    const rows = renderTable();

    const selectControl =
        <select name="departmentIdString" id="departmentIdString" onChange={onInputChange} className="form-select" value={currentEmployee.departmentIdString}>
            <option value=''>--please select--</option>
            {optionList}
        </select>;


    const employeeTable = <table className="table table-striped table-hover table-bordered" aria-labelledby="tableLabel">
        <thead>
            <tr>
                <th></th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Department Name</th>
            </tr>
        </thead>
        <tbody>
            {rows}
        </tbody>
    </table>;

    return (
        loading ? loadingDisplay :
            <div>
                <h1 id="tableLabel">Employee Data</h1>
                <form>
                    {employeeTable}
                    <fieldset className="border border-primary rounded rounded-3 p-2">
                        <legend>Add/Edit Employee</legend>
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <div className="form-floating mb-1">
                                    <input name="firstName" id="firstame" type="text" onChange={onInputChange} placeholder="First Name" className="form-control" value={currentEmployee.firstName}></input>
                                    <label className="form-label" htmlFor="firstName">First Name</label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-floating mb-1">
                                    <input name="lastName" id="lastName" type="text" onChange={onInputChange} placeholder="Last Name" className="form-control" value={currentEmployee.lastName}></input>
                                    <label className="form-label" htmlFor="lastName">Last Name</label>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <div className="form-floating mb-1">
                                    <input name="phone" id="phone" type="text" onChange={onInputChange} placeholder="Phone Number" className="form-control" value={currentEmployee.phone}></input>
                                    <label className="form-label" htmlFor="phone">Phone Number</label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-floating mb-1">
                                    <input name="email" id="email" type="text" onChange={onInputChange} placeholder="Email" className="form-control" value={currentEmployee.email}></input>
                                    <label className="form-label" htmlFor="email">Email</label>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <div className="form-floating mb-1">
                                    {selectControl}
                                    <label className="form-label" htmlFor="name">Department Name</label>
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-primary" type="button">
                            <FontAwesomeIcon icon={faSave} onClick={onSubmitForm}></FontAwesomeIcon>&nbsp;Save
                        </button>
                    </fieldset>
                </form>
            </div>
    )
}

export default Employee;