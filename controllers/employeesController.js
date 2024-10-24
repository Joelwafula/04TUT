const data ={
    employees: require('../model/employees.json'),
    setEmployees: function(data) {this.employees = data}
};


// data.employees = require('../model/employees.json')

const getAllEmployees = (req,res)=>{
    res.json(data.employees);
}

const createNewEmployee =(req,res)=>{

    const newEmployee = {
        id: data.employees[data.employees.length - 1].id || 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }

    if(!newEmployee.firstname || !newEmployee.lastname){
        return res.status(400).json({'message':"First and lastname is required"})
    }

    data.setEmployees([...data.employees, newEmployee])

    res.json(data.employees)

    // res.json({
    //     "firstname":req.body.firstname,
    //     "lastname":req.body.lastname
    // })
}

const updateEmployee = (req,res)=>{

    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id))
    if(!employee){
        return res.status(400).json({'message':`Employee id ${req.body.id} is not found`})
    }
    if(req.body.firstname) employee.firstname = req.body.firstname;
    if(req.body.lastname) employee.lastname = req.body.lastname;
    //this goes ahead and removes the existing data of the old employee
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id))
    const unsortedArray = [...filteredArray,employee];
    data.setEmployees(unsortedArray.sort((a,b)=> a.id > b.id ? 1 : a.id < b.id ? -1 : 0))

    res.json(data.employees)
    // res.json({
    //     "firstname":req.body.firstname,
    //     "lastname":req.body.lastname
    // })
}

const deleteEmployee = (req,res)=>{
    const employee = data.employees.find( emp => emp.id  === parseInt(req.body.id))
    if(!employee){
        return res.status(400).json({"message": `Employee id: ${req.body.id} not found`})
    }
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id))
    data.setEmployees([...filteredArray])
    res.json(data.employees)
 
}

const getEmployee = (req,res)=>{
   const employee = data.employees.find( emp => emp.id === parseInt(req.params.id))

   if(!employee){
    return res.status(400).json({"message":`Employee id: ${req.params.id} is not found`})
   }
   res.json(employee)
 }

 module.exports={
    createNewEmployee, 
    getAllEmployees,
    getEmployee,
    updateEmployee,
    deleteEmployee,
 }