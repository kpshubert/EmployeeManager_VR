import React, { useEffect, useState } from 'react';
import './Department.css';
import type { DepartmentModel } from '../../Models/departmentmodel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEdit, faWindowClose, faCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function Department() {

    //let departments: DepartmentModel[] = [];
    let currentDepartment: DepartmentModel = {
        id: 0,
        idString: '0',
        name: '',
        formMode: 'add',
        isAssigned: false
    };

    const fetchDepartments = async () => {
        try {
            const response = await fetch('/department?id=0&mode=list');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDepartments(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const loadingDisplay = <div>
        <div className="row mb-2">
            <div className="col-md-12">
                <FontAwesomeIcon icon={faSpinner} className="fa-spin" size="2x"></FontAwesomeIcon>
            </div>
        </div>
        <div className="row">
            <div className="col-md-12">
                Loading Department Information...
            </div>
        </div>
    </div>;

    const [departments, setDepartments] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Define the fetch function inside useEffect
    useEffect(() => {
        fetchDepartments(); // Call the fetch function
        // Optionally, return a cleanup function if needed
        return () => {
            // Cleanup code here if necessary
        };
    }, []); // Empty dependency array means this effect runs once, like componentDidMount

    const onInputChange = (event) => {
    }

    const onSubmitForm = (event) => {
    }

    const renderTable = () => {

        let returnValue = []

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
            };
            if (rows !== null && rows.length > 0) {
                returnValue = rows;
            }
        }
        return returnValue;
    }

    const renderTableReturn = renderTable();

    const departmentTable =
        <table className="table table-striped table-hover table-bordered" aria-labelledby="tableLabel">
        <thead>
            <tr>
                <th></th>
                <th>Department Name</th>
            </tr>
        </thead>
        <tbody>
            {renderTableReturn}
        </tbody>
    </table>;

    return (
        loading ? loadingDisplay :
            <div>
                <h1 id="tableLabel">Department Data</h1>
                <form>
                    {departmentTable}
                    <fieldset className="border border-primary rounded rounded-3 p-2">
                        <legend>Add/Edit Department</legend>
                        <div className="row mb-2">
                            <div className="col-md-12">
                                <div className="form-floating mb-1">
                                    <input name="name" id="name" type="text" onChange={onInputChange} placeholder="Department Name" className="form-control" value={currentDepartment.name}></input>
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

export default Department;