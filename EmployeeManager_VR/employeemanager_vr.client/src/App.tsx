import { Component } from 'react';
import { Routes, Route } from 'react-router-dom';
import Department from './Views/Department/Department';
import Employee from './Views/Employee/Employee';
import Home from './Views/Home/Home';
import "bootstrap/dist/css/bootstrap.min.css";
class App extends Component {
    render() {
        const content = (
            <>
                <nav>
                    <div className="d-flex justify-content-center">
                        <div className="row mb-2">
                            <div className="col-md-auto">
                                <a href="/">Home</a>
                            </div>
                            <div className="col-md-auto">
                                <a href="/manageemployees">Manage Employees</a>
                            </div>
                            <div className="col-md-auto">
                                <a href="/managedepartments">Manage Departments</a>
                            </div>
                        </div>
                    </div>
                </nav >
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/managedepartments' element={<Department />} />
                    <Route path='/manageemployees' element={<Employee />} />
                </Routes>
            </>
        );
        return (
            <>
                {content}
            </>
        )
    }
}

export default App;