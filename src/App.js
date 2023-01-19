import React from "react";
import { Routes, Route } from "react-router-dom";

// import Home from "./TestDataToDelete/Home";
import { PanelSection as Panel } from "./templates/Panel/PanelSection";
import { Company } from "./sections/CompanyMenu/Company";
import { CompanyForm } from "./sections/CompanyMenu/CompanyForm";
import { Branch } from "./sections/BranchesMenu/Branch";
import { BranchForm } from "./sections/BranchesMenu/BranchForm";
import { BranchInfo } from "./sections/BranchesMenu/BranchInfo/BranchInfo";
import { BranchEditWorkHours } from "./sections/BranchesMenu/BranchInfo/BranchEditWorkHours";
import { BranchEditServices } from "./sections/BranchesMenu/BranchInfo/BranchEditServices";
import { BranchEditEmployee } from "./sections/BranchesMenu/BranchInfo/BranchEditEmployee";
import { Service } from "./sections/ServicesMenu/Service";
import { ServiceForm } from "./sections/ServicesMenu/ServiceForm";
import { Employee } from "./sections/EmployeesMenu/Employee";
import { EmployeeForm } from "./sections/EmployeesMenu/EmployeeForm";
import { EmployeeCard } from "./sections/EmployeesMenu/EmployeeCard/EmployeeCard";
import { EmployeeEditService } from "./sections/EmployeesMenu/EmployeeCard/EmployeeEditService";
import { EmployeeEditBranch } from "./sections/EmployeesMenu/EmployeeCard/EmployeeEditBranch";
import { LoginPage as Login } from "./pages/Login/Login";
import { NotFound } from "./pages/NotFound/NotFound";
import { SignUp } from "./pages/SignUp/SignUp";
import { ModeProvider } from "./ModeContext";

export const App = () => {
  return (
    <ModeProvider>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/panel" element={<Panel />}>
          <Route path="company" element={<Company />}>
            <Route path="add" element={<CompanyForm />} />
            <Route path=":id/edit" element={<CompanyForm />} />
          </Route>
          <Route path="branches" element={<Branch />}>
            <Route path="add" element={<BranchForm />} />
            <Route path=":id/edit" element={<BranchForm />} />
            <Route path=":id/info" element={<BranchInfo />}>
              <Route path="edit/schedule" element={<BranchEditWorkHours />} />
              <Route path="edit/services" element={<BranchEditServices />} />
              <Route path="edit/employee" element={<BranchEditEmployee />} />
            </Route>
          </Route>
          <Route path="services" element={<Service />}>
            <Route path="add" element={<ServiceForm />} />
            <Route path=":id/edit" element={<ServiceForm />} />
          </Route>
          <Route path="employees" element={<Employee />}>
            <Route path="add" element={<EmployeeForm />} />
            <Route path=":id/edit" element={<EmployeeForm />} />
            <Route path=":id/info" element={<EmployeeCard />}>
              <Route path="edit/service" element={<EmployeeEditService />} />
              <Route path="edit/branch" element={<EmployeeEditBranch />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </ModeProvider>
  );
};
