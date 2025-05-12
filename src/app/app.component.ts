import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createEmployee, createEmployeeV1, createEmployeeV2, Employee } from './employee.type';
//test harness demonstrates runtime safety enforcement via factory functions /guards
type FactoryVersion = 'v1' | 'v2' | 'v3' | 'raw'; //raw->object literal {}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Factory Pattern Safety Demo: Employee Factory</h1>
    <div style="margin-bottom: 15px;">
<p>Current: <strong>{{ selectedVersion }}</strong></p>
    <h2>Select Factory Version:</h2>
    <button (click)="setFactoryVersion('v1')">Factory V1 (Partial&lt;Employee&gt;)</button> |
    <button (click)="setFactoryVersion('v2')">Factory V2 (loosely typed object)</button> |
    <button (click)="setFactoryVersion('v3')">Factory V3 (Super fantastic)</button> |
    <button (click)="setFactoryVersion('raw')">No Factory (object literal) </button>
    <hr />

      <h3>Test Case 1: Valid Employee</h3>
      <pre>{{ validExample }} </pre>
      <button (click)="runCase(validData, 'valid')">Run Valid Case</button>
      @if (lastRun === 'valid' && employee) {
      <h4>Result:</h4><span style="background-color:#90EE90;">Success!</span>
      <pre>{{ employee | json }}</pre>
      }

      <hr />
      <h3>Test Case 2: String ID Employee</h3>
      <pre>{{ stringIdExample }}</pre>
      <button (click)="runCase(stringIdData,'stringid')">Run String ID Case</button>
      @if (lastRun === 'stringid' && employee) {
      <h4>Result:</h4><span style="background-color:#90EE90;">Success!</span>
      <pre>{{ employee | json }}</pre>
      }

      <hr />
      <h3>Test Case 3: Invalid Garbage Data</h3>
      <pre>{{ garbageExample }}</pre>
      <button (click)="runCase(garbageData,'garbs')">Run Garbage Case</button>
      @if (lastRun === 'garbs' && employee) {
      <h4>Result:</h4><span style="background-color:#90EE90;">Success!</span>
      <pre>{{ employee | json }}</pre>
      }

      <hr />
      <h3>Test Case 4: Missing Fields</h3>
      <h4>will accept missing fields and create object, no warnings for (raw) objects [what you want]</h4>
      <pre>{{ missingExample }}</pre>
      <button (click)="runCase(missingData,'miss')">Run Missing Fields Case</button>
      @if (lastRun === 'miss' && employee) {
      <h4>Result:</h4><span style="background-color:#90EE90;">Success!</span>
      <pre>{{ employee | json }}</pre>
      }

       <!--
      <hr />
      <h3>Test Case 5: null id won't produce error but should...</h3>
      <pre>{{ nullValueExample }}</pre>
      <button (click)="runNullCrashTest(nullValueData,'nullv')">Run Null Crash Test</button>
      @if (lastRun === 'nullv' && employee) {
      <h4>Result:</h4><span style="background-color:#90EE90;">Success!</span>
      <pre>{{ employee | json }}</pre>
      }   
      -->

      <div style="background-color:#999">
      <hr />
      <h3>Test Case 6: Corrupt Data (nulls + bad types)</h3>
      <pre>{{ corruptExampleNulls }}</pre>
      <button (click)="runCase(corruptDataNulls, 'bad')">Run Corrupt Nulls Test</button>
      @if (lastRun === 'bad' && employee) {
      <h4>Result:</h4><span style="background-color:#90EE90;">Success!</span>
      <pre>{{ employee | json }}</pre>
      }

      <hr />
      <h3>Test Case 7: Missing Fields Garbage</h3>
      <pre>{{ corruptExampleMissingFields }}</pre>
      <button (click)="runCase(corruptDataMissingFields,'f')">Run Missing Fields Garbage Test</button>
      @if (lastRun === 'f' && employee) {
      <h4>Result:</h4><span style="background-color:#90EE90;">Success!</span>
      <pre>{{ employee | json }}</pre>
      }
      </div>
    </div>


  `
})
export class AppComponent {
  lastRun: string = '';
  employee: Employee | undefined;
  selectedVersion: FactoryVersion = 'v3';


  // Test case data
  validData = { id: 123, name: 'Alice', email: 'alice@company.com', department: 'Finance' };
  stringIdData = { id: "456", name: 'Bob', email: 'bob@company.com', department: 'IT' };
  garbageData = { foo: 'bar', baz: 999 };
  missingData = { id: 789, name: 'Charlie', email: 'charlie@company.com' };
  nullValueData = { id: null, name: 'Eve', email: 'eve@company.com', department: 'Legal' };
  nullValueExample = `createEmployee({ id: null, name: 'Eve', email: 'eve@company.com', department: 'Legal' })`;

  //exmple display
  validExample = `createEmployee(${JSON.stringify(this.validData)})`;
  stringIdExample = `createEmployee(${JSON.stringify(this.stringIdData)})`;
  garbageExample = `createEmployee(${JSON.stringify(this.garbageData)})`;
  missingExample = `createEmployee(${JSON.stringify(this.missingData)})`;
  //corrupted
  corruptDataNulls = { id: null, name: '', email: 'notanemail', department: '' };
  corruptExampleNulls = `createEmployee({ id: null, name: '', email: 'notanemail', department: '' })`;
  corruptDataMissingFields = { foo: 'bar', department: 123 };
  corruptExampleMissingFields = `createEmployee({ foo: 'bar', department: 123 })`;


  runCase(data: unknown, label: string = '') {
    let result: Employee;

    switch (this.selectedVersion) {
      case 'v1':
        result = createEmployeeV1(data as Partial<Employee>);
        break;
      case 'v2':
        result = createEmployeeV2(data as any);
        break;
      case 'v3':
        result = createEmployee(data);//version 3
        break;
      case 'raw':
        console.log('obj literal example (typed literal assignment) ');
        result = {
          id: (data as any).id,
          name: (data as any).name,
          email: (data as any).email,
          department: (data as any).department
        };
        break;

    }
    this.employee = result;
    this.lastRun = label;
  }
  setFactoryVersion(version: FactoryVersion) {
    this.selectedVersion = version;
    console.clear();
    console.log(this.selectedVersion);
  }

  // runNullCrashTest(data: unknown) {
  //   //should crash but console logs 0 with no crash
  //   //bad idea
  //   const broken: number = (data as any)["id"];
  //   const result = broken * 2;
  //   console.log(result);
  // }

  // causeCompileTimeError() {
  //   type Employee2 = {
  //     id: number,
  //     name: string,
  //     email: string,
  //     department: string,
  //     salary: number | string
  //   }
  //   const emp: Employee2 = {
  //     id: 1,
  //     name: 'John',
  //     email: 'john@company.com',
  //     department: 'Finance',
  //     salary: '100'
  //   };
  //   const doubleSalary = emp.salary * 2;
  //   console.log(doubleSalary);
  // }

}
