import TanstackTable from "../../Shared/Components/TanstackTable";
import { useState, useEffect } from 'react';
import type { EmployeeModel } from '../../Models/employeemodel'
import { createColumnHelper } from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faEdit, faTrashCan, faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import { faSpinner, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { fetchEmployees } from '../../Shared/Services/Employee/EmployeeService';
import { fetchDepartments } from '../../Shared/Services/Department/DepartmentService';

// Example usage
const EmployeeManager = () => {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [departments, setDepartments] = useState([]);
    const [updatingCurrent, setUpdatingCurrent] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [departmentIdString, setDepartmentIdString] = useState('');
    const [formMode, setFormMode] = useState('add');

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
        if (event.target.name === "firstName") {
            setFirstName(event.target.value);
        }
        if (event.target.name === "lastName") {
            setLastName(event.target.value);
        }
        if (event.target.name === "email") {
            setEmail(event.target.value);
        }
        if (event.target.name === "phone") {
            setPhone(event.target.value);
        }
        if (event.target.name === "departmentidString") {
            setDepartmentIdString(event.target.value);
        }
        currentEmployee[event.target.name] = event.target.value;
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
        <select name="departmentIdString" id="departmentIdString" onChange={onInputChange} className="form-select" value={departmentIdString}>
            <option value=''>--please select--</option>
            {optionList}
        </select>;

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

                const handleEdit = () => {
                    const loadCurrentEmployee = async () => {
                        setUpdatingCurrent(true);
                        if (!Number.isNaN(row.original.id)) {
                            const fetchedEmployee = await fetchEmployees(row.original.id, '');
                            if (fetchedEmployee !== null
                                && fetchedEmployee !== undefined
                                && fetchedEmployee.length !== null
                                && fetchedEmployee.length !== undefined
                                && fetchedEmployee.length === 1) {
                                currentEmployee = fetchedEmployee[0];
                                setFirstName(currentEmployee.firstName);
                                setLastName(currentEmployee.lastName);
                                setEmail(currentEmployee.email);
                                setPhone(currentEmployee.phone);
                                setDepartmentIdString(currentEmployee.departmentIdString);
                                setFormMode(currentEmployee.formMode);
                            }
                        }
                    };

                    loadCurrentEmployee();

                };

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
        const loadEmployees = async () => {
            if (!updatingCurrent) {
                try {
                    setLoading(true);
                    const employeesInfo = await fetchEmployees(0, 'list');
                    setEmployees(employeesInfo);
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

        loadEmployees();

    }, [updatingCurrent]); // Empty dependency array means this effect runs once, like componentDidMount

    function handleAddButtonClick(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
        currentEmployee.formMode = 'add';
        currentEmployee.idString = '0';
        currentEmployee.id = 0;
        currentEmployee.firstName = '';
        currentEmployee.lastName = '';
        currentEmployee.email = '';
        currentEmployee.phone = '';
        currentEmployee.departmentIdString = '';
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setDepartmentIdString('0');
        setFormMode('add');
    }

    return (
        loading ? loadingDisplay :
            <form>
                <div className="row">
                    <div className="col-md-auto">
                        <button type="button" className="btn btn-success" onClick={handleAddButtonClick}><FontAwesomeIcon icon={faPlusSquare}></FontAwesomeIcon>&nbsp;Add Employee</button>
                    </div>
                </div>
                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-4">Employee Data</h1>
                    <TanstackTable data={employees} columns={columns} initialSort='lastName' />
                </div>
                <fieldset className="border border-primary rounded rounded-3 p-2">
                    <legend>Add/Edit Employee</legend>
                    <div className="row mb-2">
                        <div className="col-md-6">
                            <div className="form-floating mb-1">
                                <input name="firstName" id="firstame" type="text" onChange={onInputChange} placeholder="First Name" className="form-control" value={firstName}></input>
                                <label className="form-label" htmlFor="firstName">First Name</label>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-floating mb-1">
                                <input name="lastName" id="lastName" type="text" onChange={onInputChange} placeholder="Last Name" className="form-control" value={lastName}></input>
                                <label className="form-label" htmlFor="lastName">Last Name</label>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-6">
                            <div className="form-floating mb-1">
                                <input name="phone" id="phone" type="text" onChange={onInputChange} placeholder="Phone Number" className="form-control" value={phone}></input>
                                <label className="form-label" htmlFor="phone">Phone Number</label>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-floating mb-1">
                                <input name="email" id="email" type="text" onChange={onInputChange} placeholder="Email" className="form-control" value={email}></input>
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
                    <button className="btn btn-primary" type="button" onClick={onSubmitForm}>
                        {submitIcon()}
                    </button>
                </fieldset>
            </form >
    );
};

export default EmployeeManager;