'use strict';

class Gasto {
  constructor(id, cantidad, categoria, desc) {
    this.id = id;
    this.cantidad = cantidad;
    this.categoria = categoria;
    this.desc = desc;
  }
}

class ControlGastos {
  constructor() {
    this.gastos = JSON.parse(localStorage.getItem('gastos')) || [];
  }

  agregarGasto(cantidad, categoria, desc) {
    let nuevoId = 1;

    if (this.gastos.length > 0) {
      const ids = this.gastos.map(g => g.id);
      nuevoId = Math.max(...ids) + 1;
    }
    const gasto = new Gasto(nuevoId, cantidad, categoria, desc);
    this.gastos.push(gasto);
    localStorage.setItem('gastos', JSON.stringify(this.gastos));

    return gasto;
  }

  editarGasto(id) {
    let gasto = this.gastos.find(g => g.id === id);
    gasto.cantidad = Number(inputCantidad.value);
    gasto.categoria = selectCategoria.value;
    gasto.desc = txtAreaDescripcion.value;
    console.log(gasto);
    localStorage.setItem('gastos', JSON.stringify(this.gastos));
    actualizarUI(gasto);
  }

  eliminarGasto(id) {
    this.gastos = this.gastos.filter(g => g.id !== id);
    localStorage.setItem('gastos', JSON.stringify(this.gastos));
  }

  obtenerTotal() {
    return this.gastos
      .reduce((acc, gasto) => acc + gasto.cantidad, 0);
  }
}

const btnAddItem = document.querySelector('.btnAddItem');
const control = new ControlGastos();
const form = document.getElementById('form');
const lista = document.getElementById('listaGastos');
const h5Total = document.getElementById('total');
const inputCantidad = document.getElementById('cantidad');
const selectCategoria = document.getElementById('categoria');
const txtAreaDescripcion = document.getElementById('desc');
const btnCancel = document.querySelector('.form__btn--cancel');
const btnClearList = document.querySelector('.clearList');

let editing = 0;
let editingNode = null;

const hide = function (element) {
  element.classList.add('hidden');
};
const show = function (element) {
  element.classList.remove('hidden');
}

const calcularTotal = function () {
  h5Total.innerHTML = 'Total $' + Number(control.obtenerTotal());
};

const actualizarUI = function (gasto) {
  let li;
  if (editing) {
    li = editingNode;
    // editingNode.innerText = `${gasto.categoria}, ${gasto.cantidad}, ${gasto.desc}`;
  } else {
    li = document.createElement('li');
  }
  li.innerHTML = `${gasto.categoria}, ${gasto.cantidad}, ${gasto.desc}`;
  const btnDelete = document.createElement('button');
  btnDelete.innerHTML = `<i class="bi bi-x-circle"></i>`;
  btnDelete.classList.add('btn', 'btn-danger', 'btn-sm');

  const btnEdit = document.createElement('button');
  btnEdit.innerHTML = `<i class="bi bi-pencil"></i>`;
  btnEdit.classList.add('btn', 'btn-primary');
  btnEdit.onclick = function () {
    editing = gasto.id;
    inputCantidad.value = gasto.cantidad;
    selectCategoria.value = gasto.categoria;
    txtAreaDescripcion.value = gasto.desc;
    editingNode = this.parentElement;
    show(form);
    hide(btnAddItem);
    editingNode.classList.add('editing');
    Array.from(lista.children).forEach((i) => {
      if (! i.classList.contains('editing')) {
        i.style.color = '#ddd';
      }
    });
  };
  li.append(btnEdit, btnDelete);
  btnDelete.onclick = function() {
    if (editing && editing === gasto.id) {
      editing = 0;
      form.reset();
    }
    control.eliminarGasto(gasto.id);
    li.remove();
    Array.from(lista.children).forEach((i) => {
      if (! i.classList.contains('editing')) {
        i.style.color = '#000';
      }
    });
    calcularTotal();
  };
  editing || lista.append(li);
  calcularTotal();
};

btnAddItem.addEventListener('click', function () {
  show(form);
  hide(btnAddItem);
})

btnCancel.addEventListener('click', function () {
  editingNode.classList.remove('editing');
  editing = 0;
  form.reset();
  hide(form);
  show(btnAddItem);
  Array.from(lista.children).forEach((i) => {
    if (! i.classList.contains('editing')) {
      i.style.color = '#000';
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  control.gastos.forEach(g => actualizarUI(g));
  form.reset();
});

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (editing) {
    control.editarGasto(editing);
  } else {
    const gasto = control.agregarGasto(
      Number(inputCantidad.value),
      selectCategoria.value,
      txtAreaDescripcion.value
    );
    actualizarUI(gasto);
  }
  editing = 0;
  editingNode.classList.remove('editing');
  Array.from(lista.children).forEach((i) => {
    if (! i.classList.contains('editing')) {
      i.style.color = '#000';
    }
  });
  this.reset();
});

btnClearList.addEventListener('click', function () {
  localStorage.removeItem('gastos');
  lista.innerHTML = '';
  control.gastos = [];
  calcularTotal();
  hide(form);
});
