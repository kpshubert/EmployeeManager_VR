import React, { Component } from 'react';
import './Employee.css';
import type { EmployeeModel } from '../../Models/employeemodel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEdit, faWindowClose, faCheckSquare } from '@fortawesome/free-regular-svg-icons';

class Employee extends Component {

    constructor() {
        super();

        this.state = {
            employees: null,
            loading: true,
            error: null
        };

        this.onInputChange = this.onInputChange.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
    }
    employees: EmployeeModel[] = [];

    currentEmployee: EmployeeModel = {
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

    onInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
        this.currentEmployee[event.target.name] = event.target.value;
    }

    onSubmitForm(event) {
        console.log(this.currentEmployee);
    }

    componentDidMount() {
        fetch('/employee?id=0&mode=list')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                this.setState({ employees: data, loading: false });
            })
            .catch(error => {
                this.setState({ error: error.message, loading: false });
            });
    }

    render() {
        const { employees, loading, error } = this.state;

        if (loading) {
            return <div>Loading...</div>;
        }
        if (error) {
            return <div>Error: {error}</div>;
        }

        if (employees !== null && employees.length !== 0) {
            const rows = [];
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
                <div>
                    <h1 id="tableLabel">Employee Data</h1>
                    <form>
                        {employeeTable}
                        <fieldset className="border border-primary rounded rounded-3 p-2">
                            <legend>Add/Edit Employee</legend>
                            <div className="row mb-2">
                                <div className="col-md-6">
                                    <div className="form-floating mb-1">
                                        <input name="firstName" id="firstame" type="text" onChange={this.onInputChange} placeholder="First Name" className="form-control" value={this.currentEmployee.firstName}></input>
                                        <label className="form-label" htmlFor="firstName">First Name</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-1">
                                        <input name="lastName" id="lastName" type="text" onChange={this.onInputChange} placeholder="Last Name" className="form-control" value={this.currentEmployee.lastName}></input>
                                        <label className="form-label" htmlFor="lastName">Last Name</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-6">
                                    <div className="form-floating mb-1">
                                        <input name="phone" id="phone" type="text" onChange={this.onInputChange} placeholder="Phone Number" className="form-control" value={this.currentEmployee.phone}></input>
                                        <label className="form-label" htmlFor="phone">Phone Number</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-1">
                                        <input name="email" id="email" type="text" onChange={this.onInputChange} placeholder="Email" className="form-control" value={this.currentEmployee.email}></input>
                                        <label className="form-label" htmlFor="email">Email</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-6">
                                    <div className="form-floating mb-1">
                                        <select name="departmentIdString" id="departmentIdString" type="text" onChange={this.onInputChange} placeholder="Department Name" className="form-select" value={this.currentEmployee.departmentIdString}>
                                            <option value=''>--please select--</option>
                                        </select>
                                        <label className="form-label" htmlFor="name">Department Name</label>
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-primary" type="button">
                                <FontAwesomeIcon icon={faSave} onClick={this.onSubmitForm}></FontAwesomeIcon>&nbsp;Save
                            </button>
                        </fieldset>
                    </form>
                </div>
            )
        }

    }
    async populateEmployeeData() {
        const response = await fetch('employee?id=0&mode=list');
        if (response.ok) {
            const data = await response.json();
            this.employees = data;
        }
    }
}

export default Employee;