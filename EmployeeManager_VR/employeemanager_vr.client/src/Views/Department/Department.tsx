import TanstackTable from "../../Shared/Components/TanstackTable";
import React, { useEffect, useState } from 'react';
import './Department.css';
import { createColumnHelper } from '@tanstack/react-table';
import type { DepartmentModel } from '../../Models/departmentmodel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faEdit, faTrashCan, faCircleXmark, faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import { faSpinner, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { fetchDepartments } from '../../Shared/Services/Department/DepartmentService';

function Department() {

    let currentDepartment: DepartmentModel = {
        id: 0,
        idString: '0',
        name: '',
        formMode: 'add',
        isAssigned: false
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
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [updatingCurrent, setUpdatingCurrent] = useState(false);
    const [departmentName, setDepartmentName] = useState('');
    const [formMode, setFormMode] = useState('add');

    useEffect(() => {
        const loadDepartments = async () => {
            if (!updatingCurrent) {
                try {
                    setLoading(true);
                    const departmentsInfo = await fetchDepartments(0, 'list');
                    setDepartments(departmentsInfo);
                } catch (err) {
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError('An unknown error occurred');
                    }
                } finally {
                    setLoading(false);
                }
            }
            setUpdatingCurrent(false);
        }

        loadDepartments();

    }, [updatingCurrent]); // Empty dependency array means this effect runs once, like componentDidMount

    const onInputChange = (event) => {
        setDepartmentName(event.target.value);
        currentDepartment[event.target.name] = event.target.value;
    }

    const onSubmitForm = (event) => {
    }

    const submitIcon = () => {
        return (
            formMode === "add" ?
                <span><FontAwesomeIcon icon={faPlusCircle} />&nbsp;Save New</span>
                :
                <span><FontAwesomeIcon icon={faFloppyDisk} />&nbsp;Update</span>
        );
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

                const handleEdit = () => {
                    const loadCurrentDepartment = async () => {
                        setUpdatingCurrent(true);
                        const currentDepartmentIdString: number = + row.original.idString;
                        if (!Number.isNaN(currentDepartmentIdString)) {
                            const fetchedDepartment = await fetchDepartments(currentDepartmentIdString, '');
                            if (fetchedDepartment !== null
                                && fetchedDepartment !== undefined
                                && fetchedDepartment.length !== null
                                && fetchedDepartment.length !== undefined
                                && fetchedDepartment.length === 1) {
                                currentDepartment = fetchedDepartment[0];
                                setDepartmentName(currentDepartment.name);
                                setFormMode(currentDepartment.formMode);
                            }
                        }
                    };

                    loadCurrentDepartment();

                };

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
                        <button id={row.original.idString}
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

    function handleAddButtonClick(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
        currentDepartment.formMode = 'add';
        currentDepartment.idString = '0';
        currentDepartment.isAssigned = false;
        currentDepartment.id = 0;
        currentDepartment.name = '';
        setDepartmentName('');
        setFormMode('add');
    }

    return (
        loading ? loadingDisplay :
            <div>
                <form>
                    <div className="row">
                        <div className="row">
                            <div className="col-md-auto">
                                <button type="button" className="btn btn-success" onClick={handleAddButtonClick}><FontAwesomeIcon icon={faPlusSquare}></FontAwesomeIcon>&nbsp;Add Department</button>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="d-flex justify-content-center">
                                <h1 id="tableLabel" className="text-2xl font-bold mb-4">Department Data</h1>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="d-flex justify-content-center">
                                <TanstackTable data={departments} columns={columns} initialSort='name' />
                            </div>
                        </div>
                    </div>
                    <fieldset className="border border-primary rounded rounded-3 p-2">
                        <legend>Add/Edit Department</legend>
                        <div className="row mb-2">
                            <div className="col-md-12">
                                <div className="form-floating mb-1">
                                    <input name="name" id="name" type="text" onChange={onInputChange} placeholder="Department Name" className="form-control" value={departmentName}></input>
                                    <label className="form-label" htmlFor="name">Department Name</label>
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-primary" type="button" onClick={onSubmitForm}>
                            {submitIcon()}
                        </button>
                    </fieldset>
                </form >
            </div >
    )
}

export default Department;