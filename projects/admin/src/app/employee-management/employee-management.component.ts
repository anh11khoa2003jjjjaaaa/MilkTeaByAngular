import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CurrencyPipe, NgFor, NgIf, CommonModule } from '@angular/common';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee.model';

import { Toast, ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, CurrencyPipe, RouterModule, CommonModule, ToastModule, ButtonModule]
})
export class EmployeeManagementComponent implements OnInit {
  @ViewChild('toast') toast!: Toast; // Reference to Toast
  @ViewChild('deleteEmployeeModal') deleteEmployeeModal!: ElementRef;
  isDeleteModalOpen: boolean = false;
  employees: Employee[] = [];
  searchTerm: string = '';
  addEmployeeForm: FormGroup; // Form for adding new employee
  updateEmployeeForm: FormGroup;
  deleteEmployeeForm: FormGroup; // Form for updating employee
  newEmployeeId: string = ''; // New employee ID
  searchMessage: string = ''; // Search message
  selectedEmployee: Employee | null = null; // Selected employee for update

  constructor(private employeeService: EmployeeService, private fb: FormBuilder, private messageService: MessageService) {
    // FormBuilder to group form controls
    this.addEmployeeForm = this.fb.group({
      employeeName: ['', Validators.required],
      position: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,12}$')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      hireDate: ['', Validators.required]
    });

    this.updateEmployeeForm = this.fb.group({
      employeeName: ['', Validators.required],
      position: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,12}$')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      hireDate: ['', Validators.required]
    });

    this.deleteEmployeeForm = this.fb.group({
      employeeID: ['', Validators.required] // Form only to hold employeeID
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  // // Generate new employee ID
  // generateNewEmployeeId(): void {
  //   const maxId = this.employees
  //     .map(employee => employee.employeeID)
  //     .filter(id => id.startsWith('EMP'))
  //     .sort()
  //     .pop() || 'EMP000'; // If no ID, start from EMP000

  //   const newIdNumber = parseInt(maxId.substring(3)) + 1; // Increment the ID
  //   this.newEmployeeId = `EMP${newIdNumber.toString().padStart(3, '0')}`; // Format new ID
  // }

  // Open the form for adding a new employee



  // loadPosition(){

  // }
  openformAdd(): void {
    const modal = document.getElementById("addEmployeeModal");
    if (modal != null) {
      modal.style.display = "block";
    }
  }

  // Add a new employee
  onSubmit(): void {
    if (this.addEmployeeForm.valid) {
      const newEmployee: Employee = {
        employeeID: this.newEmployeeId, // Use new ID
        ...this.addEmployeeForm.value
      };

      // Check for duplicate employee names
      const isDuplicateName = this.employees.some(employee => employee.employeeName.toLowerCase() === newEmployee.employeeName.toLowerCase());

      if (isDuplicateName) {
        this.showWarningAdd();
      } else {
        // Add new employee if not duplicate
        this.employeeService.addEmployee(newEmployee).subscribe(() => {
          this.loadEmployees(); // Reload employee list
          this.addEmployeeForm.reset();
          this.showSuccessAdd();
        }, error => {
          this.showErrorAdd();
          console.error('Error adding employee', error);
        });
      }
    } else {
      this.showErrorAdd();
      console.error('Form is not valid!');
    }
  }

  // Close the form for adding a new employee
  closeFormAdd(): void {
    const modal = document.getElementById("addEmployeeModal");
    if (modal != null) {
      modal.style.display = "none";
    }
  }

  // Load all employees
  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe(
      (data: Employee[]) => {
        this.employees = data;
        // this.generateNewEmployeeId(); // Generate new ID after loading employees
      },
      (error) => console.error('Error loading employees', error)
    );
  }

  // Search employee by search term
  searchEmployee(searchTerm: string): void {
    if (!searchTerm.trim()) { // If search term is empty, reload employees
      this.loadEmployees();
    } else {
      this.employeeService.searchEmployees(searchTerm).subscribe(
        (data: Employee[]) => this.employees = data,
        (error) => console.error('Error searching employee', error)
      );
    }
  }

  // Set employee to update
  setEmployeeToUpdate(employee: Employee): void {
    this.selectedEmployee = employee;
    this.updateEmployeeForm.patchValue({
      employeeName: employee.employeeName,
      position: employee.positionID,
      phone: employee.phone,
      email: employee.email,
      address: employee.address,
      hireDate: employee.hireDate
    });

    const modal = document.getElementById("updateEmployeeModal");
    if (modal != null) {
      modal.style.display = "block";
    }
  }

  // Update employee
  onUpdate(): void {
    if (this.selectedEmployee && this.updateEmployeeForm.valid) {
      const updatedEmployee: Employee = {
        employeeID: this.selectedEmployee.employeeID,
        ...this.updateEmployeeForm.value
      };

      this.employeeService.updateEmployee(updatedEmployee).subscribe(() => {
        this.loadEmployees(); // Reload employees
        this.selectedEmployee = null;
        this.showSuccessUpdate();
      }, error => {
        this.showErrorUpdate();
        console.error('Error updating employee', error);
      });
    }
  }

  // Close the form for updating an employee
  closeFormUpdate(): void {
    const modal = document.getElementById("updateEmployeeModal");
    if (modal != null) {
      modal.style.display = "none";
    }
  }

  // Set the employee to be deleted and open the delete confirmation modal
  setEmployeeToDelete(employee: Employee): void {
    const modal = document.getElementById("deleteEmployeeModal");
    if (modal != null) {
      this.selectedEmployee = employee;
      modal.style.display = "block";
    }
  }

  // Close the delete confirmation modal
  closeFormDelete(): void {
    const modal = document.getElementById("deleteEmployeeModal");
    if (modal != null) {
      modal.style.display = "none";
    }
  }

  // Confirm and delete the selected employee
  onDelete(): void {
    if (this.selectedEmployee) {
      this.employeeService.deleteEmployee(this.selectedEmployee.employeeID).subscribe(
        () => {
          this.employees = this.employees.filter(employee => employee.employeeID !== this.selectedEmployee?.employeeID);
          this.closeFormDelete(); // Close modal after deletion
        },
        error => {
          console.error('Error deleting employee', error);
        }
      );
    }
  }

  // Toast messages
  showSuccessAdd() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Employee added successfully!' });
  }
  
  showWarningAdd() {
    this.messageService.add({ severity: 'warning', summary: 'Warning', detail: 'Employee name already exists!' });
  }
  
  showErrorAdd() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add employee!' });
  }
  
  showSuccessUpdate() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Employee updated successfully!' });
  }
  
  showErrorUpdate() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update employee!' });
  }
}
