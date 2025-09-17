import ReactTable from "../../Shared/ReactTable";
import React, { useEffect, useState } from 'react';
import './Department.css';
import { createColumnHelper } from '@tanstack/react-table';
import type { DepartmentModel } from '../../Models/departmentmodel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEdit, faTrashCan, faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function Department() {

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

    const columnHelper = createColumnHelper<DepartmentModel>();
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
                        row.original.isAssigned ?
                            <span className="alert bg-info text-light p-1 pb-2 ms-1"><FontAwesomeIcon icon={faCircleXmark}></FontAwesomeIcon>&nbsp;Assigned</span>
                            :
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
        columnHelper.accessor('name', {
            header: 'Department Name',
            cell: (info) => info.getValue(),
        })
    ];
    return (
        loading ? loadingDisplay :
            <div>
                <form>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="d-flex justify-content-center">
                                <h1 id="tableLabel" className="text-2xl font-bold mb-4">Department Data</h1>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="d-flex justify-content-center">
                                <ReactTable data={departments} columns={columns} initialSort='name' />
                            </div>
                        </div>
                    </div>
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
                </form >
            </div >
    )
}

export default Department;