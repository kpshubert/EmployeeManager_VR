import React, { Component } from 'react';
import './Department.css';
import type { DepartmentModel } from '../../Models/departmentmodel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEdit, faWindowClose, faCheckSquare } from '@fortawesome/free-regular-svg-icons';

class Department extends Component {

    constructor() {
        super();

        this.state = {
            departments: null,
            loading: true,
            error: null
        };

        this.onInputChange = this.onInputChange.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
    }
    departments: DepartmentModel[] = [];

    currentDepartment: DepartmentModel = {
        id: 0,
        idString: '0',
        name: '',
        formMode: 'add',
        isAssigned: false
    };

    onInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
        this.currentDepartment[event.target.name] = event.target.value;
    }

    onSubmitForm(event) {
        console.log(this.currentDepartment);
    }

    componentDidMount() {
        fetch('/department?id=0&mode=list')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                this.setState({ departments: data, loading: false });
            })
            .catch(error => {
                this.setState({ error: error.message, loading: false });
            });

    }

    render() {
        const { departments, loading, error } = this.state;

        if (loading) {
            return <div>Loading...</div>;
        }
        if (error) {
            return <div>Error: {error}</div>;
        }

        if (departments !== null && departments.length !== 0) {
            const rows = [];
            for (let currentDepartment = 0; currentDepartment < departments.length; currentDepartment++) {
                const department = departments[currentDepartment];
                if (department.isAssigned) {
                    rows.push(
                        <tr key={currentDepartment}>
                            <td>
                                <div className="row">
                                    <div className="col-md-auto">
                                        <button type="button" className="btn btn-success" value={department.idString}>
                                            <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                                        </button>
                                    </div>
                                    <div className="col-md">
                                        <div className='text-light bg-info border border-primary rounded rounded-3 p-1 mt-1'>
                                            <FontAwesomeIcon icon={faCheckSquare}></FontAwesomeIcon>Department Asssigned
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>{department.name}</td>
                        </tr>
                    );
                } else {
                    rows.push(
                        <tr key={currentDepartment}>
                            <td>
                                <button type="button" className="btn btn-success" value={department.idString}>
                                    <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                                </button>
                                <button type="button" className="btn btn-danger" value={department.idString}>
                                    <FontAwesomeIcon icon={faWindowClose}></FontAwesomeIcon>
                                </button>
                            </td>
                            <td>{department.name}</td>
                        </tr>
                    );
                }
            }

            const departmentTable = <table className="table table-striped table-hover table-bordered" aria-labelledby="tableLabel">
                <thead>
                    <tr>
                        <th></th>
                        <th>Department Name</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>;

            return (
                <div>
                    <h1 id="tableLabel">Department Data</h1>
                    <form>
                        {departmentTable}
                        <fieldset className="border border-primary rounded rounded-3 p-2">
                            <legend>Add/Edit Department</legend>
                            <div className="row mb-2">
                                <div className="col-md-12">
                                    <div className="form-floating mb-1">
                                        <input name="name" id="name" type="text" onChange={this.onInputChange} placeholder="Department Name" className="form-control" value={this.currentDepartment.name}></input>
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
    async populateDepartmentData() {
        const response = await fetch('department?id=0&mode=list');
        if (response.ok) {
            const data = await response.json();
            this.departments = data;
        }
    }
}

export default Department;