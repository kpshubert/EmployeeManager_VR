import TanstackTable from "../../Shared/Components/TanstackTable";
import React, { useEffect, useState, useRef } from 'react';
import './Department.css';
import { createColumnHelper } from '@tanstack/react-table';
import type { DepartmentModel } from '../../Models/departmentmodel';
import type { StatusMessageParameters } from '../../Models/StatusMessageParameters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faEdit, faTrashCan, faCircleXmark, faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import { faSpinner, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { fetchDepartments, postDepartmentData, removeDepartment } from '../../Shared/Services/Department/DepartmentService';

function Department() {

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

    const [departments, setDepartments] = useState<DepartmentModel[] | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [updatingCurrent, setUpdatingCurrent] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string>('');
    const [currentDepartment, setCurrentDepartment] = useState<DepartmentModel>({
        id: 0,
        idString: '0',
        name: '',
        formMode: 'add',
        isAssigned: false
    });

    const departmentNameInputRef = useRef<HTMLInputElement | null>(null);

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
            const departmentNameInput = document.getElementById("name") as HTMLInputElement;
            departmentNameInputRef.current = departmentNameInput;
            departmentNameInputRef.current?.focus();
        }

        loadDepartments();
    }, []); // Empty dependency array means this effect runs once, like componentDidMount

    const onSubmitForm = async (event) => {
        const response = await postDepartmentData(currentDepartment);
        const returnValue = await response.json();
        if (response.ok) {
            showStatusMessage({ MessageText: `Department ${currentDepartment.formMode} complete`, TimeoutIn: 5 });
            if (currentDepartment.formMode === "add") {
                const newDepartment: DepartmentModel = {
                    id: returnValue.id,
                    idString: returnValue.id.toString(),
                    name: returnValue.name,
                    isAssigned: false,
                    formMode: 'edit'
                };
                setDepartments(prevDepartments => [...prevDepartments, newDepartment]);
            } else {
                const returnedId = returnValue.id;
                const changedName: string = returnValue.name;
                if (departments !== null) {
                    setDepartments(prevDepartments =>
                        prevDepartments.map(obj =>
                            obj.id === returnedId
                                ? { ...obj, name: changedName } // Update the name, keep other properties
                                : obj
                        )
                    );
                }
            }
        } else {
            showStatusMessage({ MessageText: `Update failed with error ${response.statusText}`, TimeoutIn: 5 })
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentDepartment(prevDepartment => ({
            ...prevDepartment,
            [name]: value
        }));
    }

    const submitIcon = () => {
        return (
            currentDepartment.formMode === "add" ?
                <span><FontAwesomeIcon icon={faPlusCircle} />&nbsp;Save New</span>
                :
                <span><FontAwesomeIcon icon={faFloppyDisk} />&nbsp;Update</span>
        );
    }

    const showStatusMessage = (statusMessageParameters: StatusMessageParameters) => {
        let timeoutInMS: number = 3000;

        if (typeof statusMessageParameters.TimeoutIn === "number") {
            timeoutInMS = statusMessageParameters.TimeoutIn * 1000;
        }
        setStatusMessage(statusMessageParameters.MessageText);
        setTimeout(() => {
            setStatusMessage('');
        }, timeoutInMS);
    }

    const columnHelper = createColumnHelper<DepartmentModel>();

    const columns = [
        // Add a custom column for actions (edit/delete)
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            enableSorting: false,
            cell: ({ row }) => {
                const handleDelete = async () => {
                    const id: number = +row.original.idString
                    if (!Number.isNaN(id)) {
                        await removeDepartment(id);
                        showStatusMessage({ MessageText: 'Department deleted', TimeoutIn: 5 });
                        setDepartments(prevDepartments => prevDepartments.filter(item => item.id !== row.original.id));
                    }
                };

                const handleEdit = () => {
                    const loadCurrentDepartment = async () => {
                        const currentDepartmentIdString: number = + row.original.idString;
                        if (!Number.isNaN(currentDepartmentIdString)) {
                            setUpdatingCurrent(true);
                            const fetchedDepartment = await fetchDepartments(currentDepartmentIdString, '');
                            if (fetchedDepartment !== null
                                && fetchedDepartment !== undefined
                                && fetchedDepartment.length !== null
                                && fetchedDepartment.length !== undefined
                                && fetchedDepartment.length === 1) {
                                setCurrentDepartment(fetchedDepartment[0]);
                            }
                            setUpdatingCurrent(false);
                        }
                    };

                    loadCurrentDepartment();
                    departmentNameInputRef.current?.focus();
                };

                const actionButtons = () => {
                    const returnValue =
                        row.original.isAssigned ?
                            <span className="alert bg-info text-light p-1 pb-2 ms-1"><FontAwesomeIcon icon={faCircleXmark}></FontAwesomeIcon>&nbsp;Assigned</span>
                            :
                            <button
                                type="button"
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
                            type="button"
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

        setCurrentDepartment({
            id: 0,
            idString: '0',
            isAssigned: false,
            name: '',
            formMode: 'add'
        });
        departmentNameInputRef.current?.focus();
    }

    const statusMessageDiv = () => {
        let returnValue = <></>;
        if (statusMessage.length > 0) {
            returnValue =
                <div className="sticky-top">
                    <div className="row md-3">
                        <div className="col-md-3"></div>
                        <div className="col-md-6">
                            <div className="d-flex justify-content-center alert alert-info border border-primary ronded rounded-3 fw-bold">{statusMessage}</div>
                        </div>
                        <div className="col-md-3"></div>
                    </div>
                </div>;
        }

        return returnValue;
    }

    const statusMessageDivOutput = statusMessageDiv();

    return (
        loading ? loadingDisplay :
            <div>
                {statusMessageDivOutput}
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
                                    <input name="name" id="name" type="text" onChange={handleChange} placeholder="Department Name" className="form-control" value={currentDepartment.name}></input>
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