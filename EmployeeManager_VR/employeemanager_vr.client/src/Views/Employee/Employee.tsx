import ReactTable from "../../Shared/ReactTable";
import { useState, useEffect } from 'react';
import type { EmployeeModel } from '../../Models/employeemodel'
import { createColumnHelper } from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faEdit, faSave } from '@fortawesome/free-regular-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

// Example usage
const EmployeeManager = () => {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [departments, setDepartments] = useState([]);
    const data = [];

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

    const onInputChange = (event) => {
    }

    const onSubmitForm = (event) => {
    }

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

    const selectControl =
        <select name="departmentIdString" id="departmentIdString" onChange={onInputChange} className="form-select" value={currentEmployee.departmentIdString}>
            <option value=''>--please select--</option>
            {optionList}
        </select>;

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

    const columnHelper = createColumnHelper<EmployeeModel>();
    const columns = [
        // Add a custom column for actions (edit/delete)
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            enableSorting: false,
            cell: ({ row }) => {
                const handleDelete = () => {
                    // This function should remove the row from the data state
                    // For example, if you're using useState to manage data:
                    //setData(prevData => prevData.filter(item => item.id !== row.original.id));
                };

                const handleEdit = () => { };

                const actionButtons = () => {
                    const returnValue =
                        <button
                            onClick={handleDelete}
                            className="btn btn-danger text-white px-2 py-1 rounded text-sm"
                        >
                            <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
                        </button>
                    return returnValue;
                };

                return (
                    <div>
                        <button
                            onClick={handleEdit}
                            className="btn btn-success text-white px-2 py-1 rounded text-sm"
                        >
                            <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                        </button>
                        {actionButtons()}
                    </div>
                );
            },
        }),
        columnHelper.accessor('firstName', {
            header: 'First Name',
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('lastName', {
            header: 'Last Name',
            cell: (info) => String(info.getValue()),
        }),
        columnHelper.accessor('email', {
            header: 'Email Address',
            cell: (info) => String(info.getValue()),
        }),
        columnHelper.accessor('phone', {
            header: 'Phone Number',
            cell: (info) => String(info.getValue()),
        }),
        columnHelper.accessor('departmentName', {
            header: 'Department',
            cell: (info) => String(info.getValue()),
        }),
    ];

    const loadingDisplay = <div>
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

    useEffect(() => {
        getEmployees();
        return () => {
            // Cleanup code here if necessary
        };
    }, []);

    return (
        loading ? loadingDisplay :
            <form>
                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-4">Employee Data</h1>
                    <ReactTable data={employees} columns={columns} initialSort='lastName' />
                </div>
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
            </form >
    );
};

export default EmployeeManager;