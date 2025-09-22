import TanstackTable from "../../Shared/Components/TanstackTable";
import { useState, useEffect } from 'react';
import type { EmployeeModel } from '../../Models/employeemodel'
import { createColumnHelper } from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faEdit, faTrashCan, faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import { faSpinner, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { fetchEmployees, postEmployeeData, removeEmployee } from '../../Shared/Services/Employee/EmployeeService';
import { fetchDepartments } from '../../Shared/Services/Department/DepartmentService';

// Example usage
const EmployeeManager = () => {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [departments, setDepartments] = useState([]);
    const [updatingCurrent, setUpdatingCurrent] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState<EmployeeModel>({
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
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setCurrentEmployee(prevEmployee => ({
            ...prevEmployee,
            [name]: value
        }));
    }

    const handleDepartmentSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentEmployee(prevEmployee => ({
            ...prevEmployee,
            [name]: value
        }));

        if (value !== null && value !== undefined) {
            const intValue = +value;
            if (!Number.isNaN(intValue))
                setCurrentEmployee(prevEmployee => ({
                    ...prevEmployee,
                    [name]: value,
                    ["departmentId"]: intValue
                }));
        }
    }

    const onSubmitForm = (event) => {
        postEmployeeData(currentEmployee);
    }

    const submitIcon = () => {
        return (
            currentEmployee.formMode === "add" ?
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
                    <option key={currentDepartment} value={department.idString}>{department.name}</option>
                );
            }
        }
        return rows;
    }

    const optionList = renderSelectControlOptions();

    const selectControl =
        <select name="departmentIdString" id="departmentIdString" onChange={handleDepartmentSelectChange} className="form-select" value={currentEmployee.departmentIdString}>
            <option key={-1} value=''>--please select--</option>
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
                    removeEmployee(row.original.id);
                    // This function should remove the row from the data state
                    // For example, if you're using useState to manage data:
                    //setData(prevData => prevData.filter(item => item.id !== row.original.id));
                };

                const handleEdit = () => {
                    const loadCurrentEmployee = async () => {
                        if (!Number.isNaN(row.original.id)) {
                            setUpdatingCurrent(true);
                            const fetchedEmployee = await fetchEmployees(row.original.id, '');
                            if (fetchedEmployee !== null
                                && fetchedEmployee !== undefined
                                && fetchedEmployee.length !== null
                                && fetchedEmployee.length !== undefined
                                && fetchedEmployee.length === 1) {
                                setCurrentEmployee(fetchedEmployee[0]);
                            }
                            setUpdatingCurrent(false);
                        }


                    };

                    loadCurrentEmployee();

                };

                const actionButtons = () => {
                    const returnValue =
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
                        <button
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
        }

        loadEmployees();

    }, []); // Empty dependency array means this effect runs once, like componentDidMount

    function handleAddButtonClick(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
        setCurrentEmployee({
            id: 0,
            idString: '0',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            departmentId: 0,
            departmentIdString: '',
            departmentName: '',
            formMode: 'add'
        });

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
                                <input name="firstName" id="firstame" type="text" onChange={handleChange} placeholder="First Name" className="form-control" value={currentEmployee.firstName}></input>
                                <label className="form-label" htmlFor="firstName">First Name</label>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-floating mb-1">
                                <input name="lastName" id="lastName" type="text" onChange={handleChange} placeholder="Last Name" className="form-control" value={currentEmployee.lastName}></input>
                                <label className="form-label" htmlFor="lastName">Last Name</label>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-6">
                            <div className="form-floating mb-1">
                                <input name="phone" id="phone" type="text" onChange={handleChange} placeholder="Phone Number" className="form-control" value={currentEmployee.phone}></input>
                                <label className="form-label" htmlFor="phone">Phone Number</label>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-floating mb-1">
                                <input name="email" id="email" type="text" onChange={handleChange} placeholder="Email" className="form-control" value={currentEmployee.email}></input>
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