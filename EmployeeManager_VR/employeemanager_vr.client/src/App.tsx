import { Routes, Route } from 'react-router-dom';
import Department from './Views/Department/Department';
import Employee from './Views/Employee/Employee';
import Home from './Views/Home/Home';
function App() {
    return (
        <>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/managedepartments' element={<Department />} />
                <Route path='/manageemployees' element={ <Employee />} />
            </Routes>
        </>
    );

}

export default App;