document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.lista-conocimientos');

    let alertas = document.querySelector('.alertas');

    if (alertas) { limpiarAlertas() };
    if (skills) { skills.addEventListener('click', agregarSkills); }

    skillsSeleccionadas();
})

const skills = new Set();
const agregarSkills = e => {
    if (e.target.tagName === 'LI') {
        if (e.target.classList.contains('activo')) {
            skills.delete(e.target.textContent);
            e.target.classList.remove('activo')
        } else {
            skills.add(e.target.textContent);
            e.target.classList.add('activo')
        }
    }
    const arraySkill = [...skills];
    document.querySelector('#skills').value = arraySkill;
}

const skillsSeleccionadas = () => {
    const selectionadas = Array.from(document.querySelectorAll('.lista-conocimientos .activo'));

    selectionadas.forEach(seleccionada => {
        skills.add(seleccionada.textContent);
    })

    const arraySkill = [...skills];
    document.querySelector('#skills').value = arraySkill;
}

const limpiarAlertas = () => {
    const alertas = document.querySelector('.alertas');

    const interval = setInterval(() => {
        if (alertas.children.length > 0) {
            alertas.removeChild(alertas.children[0])
        } else {
            alertas.parentElement.removeChild(alertas);
            clearInterval(interval);
        }
    }, 2000)
}