var inquirer = require("inquirer")
var mysql = require("mysql");
const { listenerCount } = require("process");
var PORT = process.env.PORT || 8080;
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employeeDB"
});
const startQuestion = [{
  type: "list",
  message: "What would you like to do: ",
  choices: ["View", "Add", "Edit", "Remove", "Close App"],
  name: "initialChoice"
}]
const viewQuestion = [{
  type: "list",
  message: "What would you like to view: ",
  choices: ["Departments", "Roles", "Employees"],
  name: "viewChoice"
}]
const addQuestion = [{
  type: "list",
  message: "What would you like to add: ",
  choices: ["Departments", "Roles", "Employees"],
  name: "addChoice"
}]
const editQuestion = [{
  type: "list",
  message: "What would you like to edit: ",
  choices: ["Departments", "Roles", "Employees"],
  name: "editChoice"
}]
const removeQuestion = [{
  type: "list",
  message: "What would you like to remove: ",
  choices: ["Departments", "Roles", "Employees"],
  name: "removeChoice"
}]
const emporMan = [{
  type: "list",
  choices: ["Employee", "Manager"],
  message: "What type of employee would you like to add?",
  name: "emporManChoice"
}]
const employeeAddQ = [{
  type: "input",
  message: "What is the new employee's first name?",
  name: "empFirstName"
},{
  type: "input",
  message: "What is the new employee's last name?",
  name: "empLastName"
},{
  type: "input",
  message: "What is the new employee's role ID?",
  name: "empRoleId"
},{
  type: "input",
  message: "What is the new employee's Manager's ID?",
  name: "empManId"
}]
const manAddQ = [{
  type: "input",
  message: "What is the new manager's first name?",
  name: "manFirstName"
},{
  type: "input",
  message: "What is the new manager's last name?",
  name: "manLastName"
},{
  type: "input",
  message: "What is the new manager's role ID?",
  name: "manRoleId"
}]
const addRoleQ = [{
  type: "input",
  message: "What is the name of the new role?",
  name: "newroleName"
},{
  type: "input",
  message: "How much does the new role pay per hour?",
  name: "newroleSalary"
},{
  type: "input",
  message: "What department ID does this new role belong to?",
  name: "newroleDept"
}]
const addDeptQ = [{
  type: "input",
  message: "What is the name of the new department?",
  name: "addDept"
}]
const delDept = [{
  type: "input",
  message: "What department would you like to remove?",
  name: "delDeptName"
}]
const delRole =[{
  type: "input",
  message: "What Role would you like to remove?",
  name: "delRoleName"
}]
const delEmp =[{
  type: "input",
  message: "What is the first name of the employee you wish to delete?",
  name: "delempFirst"
},{
  type: "input",
  message: "What is the last name of the employee you wish to delete?",
  name: "delempLast"
}]
const delMan = [{
  type: "input",
  message: "What is the first name of the manager you wish to delete?",
  name: "delManFirst"
},{
  type: "input",
  message: "What is the last name of the manager you wish to delete?",
  name: "delManLast"
}]
const editRole = []
const editDept = []
const editMan = []
const editEmp = []
var sql = "SELECT employee.first_name as FirstName, employee.last_name as LastName, Emprole.title as JobTitle,  Emprole.salary as Salary, CONCAT(manager.first_name, ' ' ,manager.last_name) as Manager FROM employee INNER JOIN manager ON employee.manager_id = manager.role_id INNER JOIN Emprole on employee.role_id = Emprole.id"
// Bonus points if you're able to:
//   * Update employee managers
//   * View employees by manager
//   * Delete departments, roles, and employees
//   * View the total utilized budget of a department -- ie the combined salaries of all employees in that department
function appStart(){
  inquirer.prompt(startQuestion).then(res => {
    switch(res.initialChoice){
      case "View":
        inquirer.prompt(viewQuestion).then(res => {
          switch(res.viewChoice){
            case "Departments":
              connection.query("SELECT * FROM departments", function (err, response){
                if(err) throw (err);
                console.table(response)
                appStart();
              })
            break;
            case "Roles":
              connection.query("SELECT * FROM emprole", function (err, response){
                if(err) throw (err);
                console.table(response)
                appStart();
              })
            break;
            case "Employees":
              connection.query(sql, function (err, response){
                if(err) throw (err);
                console.table(response)
                appStart();
              })
            break;
          }
          
        })
      return;
      case "Add":
        inquirer.prompt(addQuestion).then(res => {
          switch(res.addChoice){
            case "Departments":
              inquirer.prompt(addDeptQ).then(res => {
                connection.query(
                  "INSERT INTO departments SET ?",
                  {
                    deptName: res.addDept
                  }, function(err, res) {
                    if (err) throw err;
                    console.log("Department added successfully!")
                    appStart();
                  }
                )
              })
            break;
            case "Roles":
              inquirer.prompt(addRoleQ).then(res => {
                connection.query(
                  "INSERT INTO emprole SET ?",
                  {
                    title: res.newroleName,
                    salary: res.newroleSalary,
                    department_id: res.newroleDept
                  }, function(err, res) {
                    if (err) throw err;
                    console.log("Department added successfully!")
                    appStart();
                  }
                )
              })
            break;
            case "Employees":
              inquirer.prompt(emporMan).then(response => {
                switch(response.emporManChoice){
                  case "Employee":
                    inquirer.prompt(employeeAddQ).then(res => {
                      connection.query(
                        "INSERT INTO employee SET ?",
                        {
                          first_name: res.empFirstName,
                          last_name: res.empLastName,
                          role_id: res.empRoleId,
                          manager_id: res.empManId
                        },function(err, res) {
                          if (err) throw err;
                          console.log("Employee Added successfully!")
                          appStart()
                        }
                      )
                    })
                  break;
                  case "Manager":
                    inquirer.prompt(manAddQ).then(res => {
                      connection.query(
                        "INSERT INTO manager SET ?",
                        {
                          first_name: res.manFirstName,
                          last_name: res.manLastName,
                          role_id: res.manRoleId,
                        },function(err, res) {
                          if (err) throw err;
                          console.log("Manager Added successfully!")
                          appStart()
                        }
                      )
                    })
                  break;
                }
              })
            break;
          }
        })
      return;
      case "Edit":
        inquirer.prompt(editQuestion).then(res => {
          switch(res.editChoice){
            case "Role":
            break;
            case "Department":
            break;
            case "Employee":
            break;
          }
        })
      return;
      case "Remove":
        inquirer.prompt(removeQuestion).then(res => {
          switch(res.removeChoice){
            case "Departments":
              inquirer.prompt(delDept).then(res => {
                connection.query(
                  "DELETE FROM departments WHERE deptName = ?",
                  [res.delDeptName],function(err, res){
                    if (err) throw err;
                    console.log("Department deleted succesfully!")
                    appStart()
                  }
                )
              })
            break;
            case "Roles":
              inquirer.prompt(delRole).then(res => {
                connection.query(
                  "DELETE FROM emprole WHERE title = ?",
                  [res.delRoleName],function(err, res){
                    if (err) throw err;
                    console.log("Role deleted succesfully!")
                    appStart()
                  }
                )
              })
            break;
            case "Employees":
              inquirer.prompt(emporMan).then(response => {
                switch(response.emporManChoice){
                  case "Employee":
                    inquirer.prompt(delEmp).then(res => {
                      connection.query(
                        "DELETE FROM employee WHERE first_name = ? AND last_name = ?",
                        [
                          res.delempFirst,
                          res.delempLast,
                        ],function(err, res) {
                          if (err) throw err;
                          console.log("Employee deleted successfully!")
                          appStart()
                        }
                      )
                    })
                  break;
                  case "Manager":
                    inquirer.prompt(delMan).then(res => {
                    var  todeleteFirst = res.delManFirst
                    var  todeleteLast = res.delManLast
                      connection.query(
                        "DELETE FROM manager WHERE first_name = ? AND last_name = ?",
                        [todeleteFirst,
                        todeleteLast]
                        ,function(err, res) {
                          if (err) throw err;
                          console.log("Manager deleted successfully!")
                          appStart()
                        }
                      )
                    })
                    break;
                }
              });
            break;
          }
        })
      return;
      case "Close App":
        console.log("The app will now close, thank you for using this app!")
        connection.end();
      return;
    }
  })
}
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
  appStart()
});
