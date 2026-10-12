const cl = console.log;

const studentForm = document.getElementById('studentForm');
const fname = document.getElementById('fname');
const lname = document.getElementById('lname');
const email = document.getElementById('email');

const age = document.getElementById('age');
const course = document.getElementById('course');
const addstdBtn = document.getElementById('addstdBtn');
const updatestdBtn = document.getElementById('updatestdBtn');

const stdContainer = document.getElementById('stdContainer');
const spinner = document.getElementById('spinner');

const base_url = `https://todocrud2-705b3-default-rtdb.firebaseio.com`;
const std_url = `${base_url}/student1.json`;



const state = {
    stdArr: [],
    edit_id: null
}

function showSpinner() {
    spinner.classList.remove('d-none');
}

function hideSpinner() {
    spinner.classList.add('d-none');
}

function objToArr(obj) {
    state.stdArr = [];
    for (const key in obj) {
        obj[key].id = key;
        state.stdArr.push(obj[key]);
    }
}

function snackBar(msg, icon) {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 2000,
        confirmButtonColor: '#212529'
    })
}

//create

async function oncreatestd(eve) {
    try {
        showSpinner();
        eve.preventDefault();
        let std_obj = {
            fname: fname.value,
            lname: lname.value,
            email: email.value,
            age: age.value,
            course: course.value
        }
        let res = await fetch(std_url, {
            method: "POST",
            body: JSON.stringify(std_obj),
            headers: {
                "Content-Type": "Application/json"
            }
        })
        if (!res.ok) {
            throw new Error('Error:' + res.status)
        }
        let data = await res.json();
        std_obj.id = data.name;
        state.stdArr.push(std_obj);

        let tr = document.createElement('tr');
        tr.id = std_obj.id;
        tr.innerHTML = `
                                <td>${state.stdArr.length}</td>
                                <td>${std_obj.fname}</td>
                                <td>${std_obj.lname}</td>
                                <td>${std_obj.email}</td>
                                <td>${std_obj.age}</td>
                                <td>${std_obj.course}</td>
                                <td><button type="button" onclick="onEdit(this)" class="btn btn-sm btn-success">Edit</button></td>
                                <td><button type="button" onclick="onRemove(this)" class="btn btn-sm btn-danger">Remove</button></td>
            `
        stdContainer.append(tr);
        snackBar(`new Student added successfully`, 'success');
        studentForm.reset();
    }
    catch (err) {
        snackBar(err.message, 'error');
    }
    finally {
        hideSpinner();
    }
}

//read
async function fetchStd() {
    showSpinner();
    try {
        let res = await fetch(std_url, {
            method: "GET",
            body: null,
            headers: {
                "content-type": "Application-type/json",
            }
        })
        if (!res.ok) {
            throw new Error('error');
        }
        let data = await res.json();
        objToArr(data);
        readstd(state.stdArr);

    }
    catch (err) {
        snackBar(err.message, 'error');
    }
    finally {
        hideSpinner()
    }
}
fetchStd();

function readstd(arr) {
    let result = ``;
    arr.forEach((std, i) => {
        result += `
                                <tr id="${std.id}">
                                   <td>${i + 1}</td>
                                <td>${std.fname}</td>
                                <td>${std.lname}</td>
                                <td>${std.email}</td>
                                <td>${std.age}</td>
                                <td>${std.course}</td>
                                <td><button type="button" onclick="onEdit(this)" class="btn btn-sm btn-success">Edit</button></td>
                                <td><button type="button" onclick="onRemove(this)" class="btn btn-sm btn-danger">Remove</button></td>
                                </tr>
    `
    })
    stdContainer.innerHTML = result;
}

//EDIT
function onEdit(ele) {
    let EDIT_ID = ele.closest('tr').id;
    state.edit_id = EDIT_ID;
    let EDIT_OBJ = state.stdArr.find(std => std.id === EDIT_ID);
    fname.value = EDIT_OBJ.fname;
    lname.value = EDIT_OBJ.lname;
    email.value = EDIT_OBJ.email;
    age.value = EDIT_OBJ.age;
    course.value = EDIT_OBJ.course;
    addstdBtn.classList.add('d-none');
    updatestdBtn.classList.remove('d-none');
}


//update
async function onupdate() {
    try {
        showSpinner();
        let update_id = state.edit_id;
        let updated_url = `${base_url}/student1/${update_id}.json`;
        let updated_obj = {
            fname: fname.value,
            lname: lname.value,
            email: email.value,
            age: age.value,
            course: course.value,
            id: update_id
        }
        let res = await fetch(updated_url, {
            method: "PATCH",
            body: JSON.stringify(updated_obj),
            headers: {
                "content-type": "application-type/json",
            }
        })
        if (!res.ok) {
            throw new Error(err);
        }
        let data = await res.json();
        let getIndex = state.stdArr.findIndex(std => std.id === update_id);
        state.stdArr[getIndex] = updated_obj;
        let tr = document.getElementById(update_id);
        tr.innerHTML = `
                                <td>${getIndex + 1}</td>
                                <td>${data.fname}</td>
                                <td>${data.lname}</td>
                                <td>${data.email}</td>
                                <td>${data.age}</td>
                                <td>${data.course}</td>
                                <td><button type="button" onclick="onEdit(this)" class="btn btn-sm btn-success">Edit</button></td>
                                <td><button type="button" onclick="onRemove(this)" class="btn btn-sm btn-danger">Remove</button></td>
            `
        studentForm.reset();
        state.edit_id = null;
        snackBar("Student updated successfully", 'success');

        addstdBtn.classList.remove('d-none');
        updatestdBtn.classList.add('d-none');
    }
    catch (err) {
        snackBar(err.message, 'error');
    }
    finally {
        hideSpinner()
    }
}
//Delete

async function onRemove(ele) {
    let remove_id = ele.closest('tr').id;
    let remove_url = `${base_url} /student1/${remove_id}.json`;
    let getConfirm = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    })
    if (getConfirm.isConfirmed) {
        try {
            showSpinner();
            let res = await fetch(remove_url, {
                method: "DELETE",
                headers: {
                    "content-type": "Application-type/json",
                }
            })
            if (!res.ok) {
                throw new Error('error');
            }
            let getIndex = state.stdArr.findIndex(std => std.id === remove_id);
            state.stdArr.splice(getIndex, 1);
            ele.closest('tr').remove();
            let tr = document.querySelectorAll("#stdContainer tr td:first-child")
            tr.forEach((e, i) => e.innerText = i + 1)

            snackBar(`The Student with ${remove_id} is removed successfully`, 'success');
        }
        catch (err) {
            snackBar(err.message, 'error');
        }
        finally {
            hideSpinner();
        }
    }
}
studentForm.addEventListener('submit', oncreatestd);
updatestdBtn.addEventListener('click', onupdate);